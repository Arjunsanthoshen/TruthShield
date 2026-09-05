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

const GEMINI_MODEL = 'gemini-3.6-flash';
const REQUEST_TIMEOUT_MS = 30000;

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
  } catch {
    throw new Error(`Gemini returned non-JSON response. Raw: ${text.slice(0, 200)}`);
  }

  // Validate required top-level fields
  const VALID_VERDICTS = ['Likely AI-Generated', 'Potentially Manipulated', 'Likely Authentic', 'Inconclusive'];
  if (!parsed.verdict || !VALID_VERDICTS.includes(parsed.verdict)) {
    // Coerce to nearest valid verdict or default
    parsed.verdict = 'Inconclusive';
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

  // Convert buffer to base64 inline data
  const base64Data = fileBuffer.toString('base64');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let text;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
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
      ]
    });

    text = response.text;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`Gemini analysis request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
      timeoutErr.status = 504;
      throw timeoutErr;
    }

    // Handle Gemini API errors: extract status and message safely
    const status = err.status || err.httpStatus || 500;
    const msg = err.message || 'Unknown Gemini API error';

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
    if (status === 429) {
      const rateErr = new Error('Gemini API rate limit exceeded. Please try again in a moment.');
      rateErr.status = 429;
      throw rateErr;
    }

    const genericErr = new Error(`Gemini API error (HTTP ${status}): ${msg}`);
    genericErr.status = 502;
    throw genericErr;
  } finally {
    clearTimeout(timeoutId);
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

  console.log(`[GeminiService] Analysis complete for "${filename}" — verdict: ${analysis.verdict}, confidence: ${analysis.confidence}`);

  return {
    success: true,
    provider: 'Gemini',
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

export default { analyzeImageWithGemini };
