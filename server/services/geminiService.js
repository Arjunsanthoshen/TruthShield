/**
 * TruthShield Gemini Multimodal Image Analysis Service
 *
 * Uses the official Google Gemini API (@google/genai SDK) to analyze
 * uploaded images for indicators of AI generation or manipulation.
 *
 * Security:
 *  - GEMINI_API_KEY is read server-side only (process.env).
 *  - The key is never logged, included in responses, or sent to the client.
 */

import { GoogleGenAI } from '@google/genai';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const FALLBACK_GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.6-flash'
];
const REQUEST_TIMEOUT_MS = 30000;

/**
 * Get prioritized candidate models starting with the configured model
 * followed by proven fallback models without duplicates.
 */
export function getCandidateModels() {
  const configured = (process.env.GEMINI_MODEL || '').trim() || DEFAULT_GEMINI_MODEL;
  const list = [configured, ...FALLBACK_GEMINI_MODELS];
  return Array.from(new Set(list));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Invoke Gemini with a strict timeout guard and direct JSON streaming for lowest latency
 */
async function callGeminiWithTimeout(ai, model, contents, timeoutMs) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(`Gemini request to ${model} timed out after ${timeoutMs / 1000} seconds.`);
      err.status = 504;
      reject(err);
    }, timeoutMs);
  });

  try {
    const callPromise = ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });
    return await Promise.race([callPromise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}


const ANALYSIS_PROMPT = `You are an image authenticity analysis assistant for TruthShield.

Analyze the provided image for visual indicators that may suggest:
- AI generation or synthetic origin
- Synthetic image artifacts (noise patterns, diffusion artifacts, hallucinated details)
- Image manipulation or compositing
- Inconsistent lighting or shadow directionality
- Anatomy or object inconsistencies (hands, fingers, teeth, ears)
- Unnatural textures or overly perfect skin/surfaces
- Repeated background patterns
- Text rendering anomalies or garbled text
- Blending or edge artifacts from compositing
- Other observable visual inconsistencies

IMPORTANT CONSTRAINTS:
- Do not claim that visual inspection alone can definitively prove whether an image is authentic or fake.
- Base your assessment ONLY on observable visual characteristics in the provided image.
- Avoid absolute certainty. Use cautious language: "may suggest", "indicators of", "consistent with".
- If there is insufficient evidence to form an assessment, clearly say so.
- Never claim 100% certainty in either direction.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences, raw JSON only):
{
  "verdict": "Likely AI-Generated | Potentially Manipulated | Likely Authentic | Inconclusive",
  "confidence": 0.0,
  "summary": "Short 1-2 sentence human-readable assessment",
  "signals": [
    {
      "name": "Signal name",
      "observation": "What was specifically observed in this image",
      "impact": "supports_ai | supports_authentic | neutral"
    }
  ],
  "visualObservations": [
    "Observable characteristic from the image"
  ],
  "manipulationIndicators": [
    "Specific indicator if present, or empty array if none observed"
  ],
  "limitations": [
    "Important limitation of this visual assessment"
  ]
}

The confidence value (0.0 to 1.0) represents your assessment confidence given the observable evidence — not objective truth about the image's authenticity.`;

/**
 * Parse and validate structured JSON from Gemini's text output.
 * Handles cases where Gemini wraps JSON in markdown code fences.
 *
 * @param {string} text - Raw text from Gemini
 * @returns {object} Parsed and validated analysis object
 */
function parseGeminiJson(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      parsed = parsed[0];
    }
  } catch {
    throw new Error(`Gemini returned non-JSON response. Raw: ${text.slice(0, 200)}`);
  }

  // Validate required top-level fields
  const VALID_VERDICTS = ['Likely AI-Generated', 'Potentially Manipulated', 'Likely Authentic', 'Inconclusive'];
  if (!parsed.verdict || !VALID_VERDICTS.includes(parsed.verdict)) {
    const lower = (parsed.verdict || '').toLowerCase();
    if (lower.includes('ai') || lower.includes('synthetic')) {
      parsed.verdict = 'Likely AI-Generated';
    } else if (lower.includes('manipulat') || lower.includes('edit')) {
      parsed.verdict = 'Potentially Manipulated';
    } else if (lower.includes('auth') || lower.includes('real')) {
      parsed.verdict = 'Likely Authentic';
    } else {
      parsed.verdict = 'Inconclusive';
    }
  }

  // Ensure numeric confidence in [0,1]
  const rawConf = parseFloat(parsed.confidence);
  parsed.confidence = isNaN(rawConf) ? 0.5 : Math.min(1, Math.max(0, rawConf));

  parsed.summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : 'No summary provided.';
  parsed.signals = Array.isArray(parsed.signals) ? parsed.signals : [];
  parsed.visualObservations = Array.isArray(parsed.visualObservations) ? parsed.visualObservations : [];
  parsed.manipulationIndicators = Array.isArray(parsed.manipulationIndicators) ? parsed.manipulationIndicators : [];
  parsed.limitations = Array.isArray(parsed.limitations) ? parsed.limitations : [
    'Visual AI detection is probabilistic and can produce false positives and false negatives.',
    'This assessment is based solely on observable visual characteristics.'
  ];

  // Ensure default limitations are always present
  const defaultLimitations = [
    'Visual AI detection is probabilistic and can produce false positives and false negatives.',
    'This assessment is based solely on observable visual characteristics and is not definitive proof.'
  ];
  for (const lim of defaultLimitations) {
    if (!parsed.limitations.some(l => l.includes('probabilistic') || l.includes('definitive'))) {
      parsed.limitations.push(lim);
    }
  }

  return parsed;
}

/**
 * Sanitize error messages to ensure API keys are never leaked in errors or logs.
 */
function sanitizeErrorMessage(message) {
  if (!message || typeof message !== 'string') return 'Unknown Gemini API error';
  return message
    .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]')
    .replace(/key=[^&\s]+/gi, 'key=[REDACTED]');
}

/**
 * Analyze an image buffer with Gemini multimodal analysis.
 *
 * @param {Buffer} fileBuffer - The uploaded image data
 * @param {string} mimeType   - MIME type (e.g. 'image/jpeg')
 * @param {string} filename   - Original filename for logging/metadata
 * @returns {Promise<object>} Normalized TruthShield analysis result
 */
export async function analyzeImageWithGemini(fileBuffer, mimeType, filename = 'image') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const err = new Error('Gemini API key is not configured on the server. Please add GEMINI_API_KEY to the server .env file.');
    err.status = 500;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const base64Data = fileBuffer.toString('base64');
  const candidateModels = getCandidateModels();

  let text = null;
  let successfulModel = null;
  let lastError = null;

  for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
    const model = candidateModels[mIdx];

    // Attempt up to 2 times for transient issues (503 high demand, 429 rate limit)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await callGeminiWithTimeout(
          ai,
          model,
          [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                },
                { text: ANALYSIS_PROMPT }
              ]
            }
          ],
          REQUEST_TIMEOUT_MS
        );

        text = response.text;
        successfulModel = model;
        break;
      } catch (err) {
        lastError = err;
        const status = err.status || err.httpStatus || 500;
        const msg = sanitizeErrorMessage(err.message);

        // Terminal client errors: invalid format, safety policy, bad auth
        // Changing models or retrying will not fix these.
        if (status === 400) {
          const badReqErr = new Error(`Gemini rejected the image (unsupported format or content policy): ${msg}`);
          badReqErr.status = 400;
          throw badReqErr;
        }
        if (status === 401 || status === 403) {
          const authErr = new Error(`Gemini authentication failed (HTTP ${status}). Check GEMINI_API_KEY.`);
          authErr.status = 401;
          throw authErr;
        }

        // Check if retryable
        const isTemporary = status === 503 || status === 429 || status === 500 || status === 504;
        if (isTemporary && attempt < 2) {
          console.warn(`[GeminiService] Model ${model} returned HTTP ${status} (attempt ${attempt}/2). Retrying in 1.2s...`);
          await sleep(1200);
          continue;
        }

        // If attempt >= 2 or non-retryable for this model, move to next model in fallback list
        console.warn(`[GeminiService] Model ${model} failed (HTTP ${status}: ${msg}). Attempting fallback model if available...`);
        break;
      }
    }

    if (text) {
      break;
    }
  }

  if (!text) {
    const lastStatus = lastError?.status || lastError?.httpStatus || 502;
    const lastMsg = sanitizeErrorMessage(lastError?.message);

    if (lastStatus === 503) {
      const highDemandErr = new Error(
        'Gemini API error (HTTP 503): Google Gemini models are currently experiencing temporary high demand. Spikes in demand are usually temporary. Please try again shortly.'
      );
      highDemandErr.status = 502;
      throw highDemandErr;
    }

    if (lastStatus === 429) {
      const rateErr = new Error('Gemini API rate limit exceeded. Please try again in a moment.');
      rateErr.status = 429;
      throw rateErr;
    }

    if (lastStatus === 504) {
      const timeoutErr = new Error(`Gemini analysis request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
      timeoutErr.status = 504;
      throw timeoutErr;
    }

    const genericErr = new Error(`Gemini API error (HTTP ${lastStatus}): ${lastMsg}`);
    genericErr.status = 502;
    throw genericErr;
  }

  // Parse and validate Gemini's structured JSON response
  let analysis;
  try {
    analysis = parseGeminiJson(text);
  } catch (parseErr) {
    console.error('[GeminiService] Failed to parse Gemini JSON output:', parseErr.message);
    const err = new Error('Gemini returned an unstructured response. Please try again.');
    err.status = 502;
    throw err;
  }

  console.log(`[GeminiService] Analysis complete with ${successfulModel} for "${filename}" — verdict: ${analysis.verdict}, confidence: ${analysis.confidence}`);

  return {
    success: true,
    provider: 'Gemini',
    model: successfulModel,
    file: {
      name: filename,
      size: fileBuffer.length,
      type: mimeType
    },
    analysis: {
      verdict: analysis.verdict,
      confidence: analysis.confidence,
      summary: analysis.summary,
      signals: analysis.signals,
      visualObservations: analysis.visualObservations,
      manipulationIndicators: analysis.manipulationIndicators,
      limitations: analysis.limitations,
      analyzedAt: new Date().toISOString()
    }
  };
}

export { parseGeminiJson, sanitizeErrorMessage };
export default {
  analyzeImageWithGemini,
  parseGeminiJson,
  sanitizeErrorMessage,
  getCandidateModels,
  DEFAULT_GEMINI_MODEL,
  FALLBACK_GEMINI_MODELS
};

