/**
 * TruthShield Hive AI Detection Service
 *
 * Implements the official documented Hive synchronous task endpoint:
 * POST https://api.hivemoderation.com/api/v2/task/sync
 *
 * Requirements per official Hive documentation:
 * - Content-Type: application/json
 * - Authorization: token <HIVE_API_KEY>
 * - models: ["ai_generated_media"]
 * - user_id: alphanumeric string (no spaces, underscores, semicolons)
 * - post_id: unique alphanumeric string
 * - url: accessible image URL
 */

const DEFAULT_HIVE_ENDPOINT = 'https://api.hivemoderation.com/api/v2/task/sync';
const REQUEST_TIMEOUT_MS = 25000;

/**
 * Determine a transparent, probabilistic verdict based on Hive's scores.
 * Uses Hive's documented recommended threshold of approximately 0.9.
 * Communicates assessments rather than absolute claims of truth.
 *
 * @param {number|null} aiScore - Probability of AI generation (0 - 1)
 * @param {number|null} notAiScore - Probability of human/not-AI (0 - 1)
 * @param {number|null} deepfakeScore - Probability of deepfake manipulation (0 - 1)
 * @returns {{ verdict: string, verdictType: string, verdictDescription: string }}
 */
export function computeVerdict(aiScore, notAiScore, deepfakeScore) {
  // Deepfake detection threshold ~0.90 per Hive documentation
  if (deepfakeScore !== null && deepfakeScore >= 0.90) {
    return {
      verdict: 'Potential Deepfake Detected',
      verdictType: 'deepfake',
      verdictDescription: 'Classifier analysis indicates elevated probability of facial manipulation or deepfake synthesis.'
    };
  }

  // Strong AI generation signal (threshold >= 0.90 per Hive documentation)
  if (aiScore !== null && aiScore >= 0.90) {
    return {
      verdict: 'Likely AI-Generated',
      verdictType: 'ai_generated',
      verdictDescription: 'Neural classifier analysis indicates high likelihood of synthetic diffusion or generative model output.'
    };
  }

  // Strong authentic/human signal (threshold >= 0.90 per Hive documentation)
  if (notAiScore !== null && notAiScore >= 0.90) {
    return {
      verdict: 'Likely Authentic / Not Detected as AI-Generated',
      verdictType: 'authentic',
      verdictDescription: 'No significant AI synthesis or generative artifacts detected in this media.'
    };
  }

  // Borderline or intermediate cases
  if (aiScore !== null && notAiScore !== null) {
    const diff = Math.abs(aiScore - notAiScore);
    if (diff < 0.20 || (aiScore >= 0.35 && aiScore <= 0.65)) {
      return {
        verdict: 'Inconclusive / Mixed Signals',
        verdictType: 'inconclusive',
        verdictDescription: 'Visual forensic signals are borderline or mixed. Independent human verification is recommended.'
      };
    }

    if (aiScore > notAiScore) {
      return {
        verdict: 'Moderate Indicators of AI Generation',
        verdictType: 'moderate_ai',
        verdictDescription: 'Elevated indicators of AI generation detected, but below definitive confidence thresholds.'
      };
    }

    return {
      verdict: 'Low Probability of AI Generation',
      verdictType: 'low_ai',
      verdictDescription: 'Minimal generative markers detected. Media is predominantly consistent with non-synthetic capture.'
    };
  }

  return {
    verdict: 'Inconclusive',
    verdictType: 'inconclusive',
    verdictDescription: 'Insufficient class confidence scores returned to determine an assessment.'
  };
}

/**
 * Format and round a score to a standard decimal (0.000 to 1.000).
 *
 * @param {number|null} score
 * @returns {number|null}
 */
export function roundScore(score) {
  if (typeof score !== 'number' || isNaN(score)) return null;
  return Math.round(score * 1000) / 1000;
}

/**
 * Extract classes and algorithmic tags from Hive response envelopes.
 *
 * @param {object} data - Raw JSON response from Hive
 * @returns {{ classes: Array|null, algorithmicTags: object|null }}
 */
export function extractClassesAndTags(data) {
  if (!data || typeof data !== 'object') {
    return { classes: null, algorithmicTags: null };
  }

  // Standard Task Envelope: data.status[0].response.output[0]
  if (Array.isArray(data.status) && data.status[0]?.response?.output?.[0]) {
    const out = data.status[0].response.output[0];
    return {
      classes: out.classes || null,
      algorithmicTags: out.algorithmic_tags || null
    };
  }

  // Direct Output Envelope: data.output[0]
  if (Array.isArray(data.output) && data.output[0]) {
    const out = data.output[0];
    return {
      classes: out.classes || null,
      algorithmicTags: out.algorithmic_tags || null
    };
  }

  // Nested Response Envelope: data.response.output[0]
  if (data.response?.output?.[0]) {
    const out = data.response.output[0];
    return {
      classes: out.classes || null,
      algorithmicTags: out.algorithmic_tags || null
    };
  }

  // Top-level classes array
  if (Array.isArray(data.classes)) {
    return {
      classes: data.classes,
      algorithmicTags: data.algorithmic_tags || null
    };
  }

  return { classes: null, algorithmicTags: null };
}

/**
 * Sanitize an error or response body to ensure no sensitive tokens or keys are leaked.
 *
 * @param {any} body
 * @returns {any}
 */
export function sanitizeHiveResponse(body) {
  if (!body) return null;
  if (typeof body === 'string') {
    return body.replace(/Bearer\s+[A-Za-z0-9_.-]+/gi, 'Bearer [REDACTED]')
               .replace(/token\s+[A-Za-z0-9_.-]+/gi, 'token [REDACTED]');
  }
  if (typeof body === 'object') {
    const copy = Array.isArray(body) ? [...body] : { ...body };
    for (const key of Object.keys(copy)) {
      if (/key|auth|token|secret/i.test(key)) {
        copy[key] = '[REDACTED]';
      } else if (typeof copy[key] === 'object') {
        copy[key] = sanitizeHiveResponse(copy[key]);
      }
    }
    return copy;
  }
  return body;
}

/**
 * Execute Hive image analysis using the official documented JSON task sync endpoint.
 *
 * @param {string} mediaUrl - Publicly accessible media URL for the image
 * @param {object} fileMeta - Metadata about the uploaded file
 * @param {string} fileMeta.name - Filename
 * @param {number} fileMeta.size - File size in bytes
 * @param {string} fileMeta.type - File MIME type
 * @returns {Promise<object>} Normalized TruthShield detection result
 */
export async function analyzeImageWithHiveUrl(mediaUrl, fileMeta = {}) {
  const apiKey = process.env.HIVE_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const err = new Error('Hive API key is not configured on the server. Please configure HIVE_API_KEY in the server .env file.');
    err.status = 500;
    throw err;
  }

  const endpoint = process.env.HIVE_API_ENDPOINT || DEFAULT_HIVE_ENDPOINT;

  // Formulate authorization header per Hive documentation: 'Authorization: token <API_KEY>'
  const trimmedKey = apiKey.trim();
  const authHeader = trimmedKey.toLowerCase().startsWith('token ')
    ? trimmedKey
    : (trimmedKey.startsWith('Bearer ') ? trimmedKey : `token ${trimmedKey}`);

  // Build documented JSON task payload
  // user_id and post_id must be alphanumeric without spaces, semicolons, or underscores
  const payload = {
    user_id: 'truthshielduser1',
    post_id: `ts${Date.now()}`,
    models: ['ai_generated_media'],
    url: mediaUrl
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutError = new Error(`Hive detection request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds. Please try again.`);
      timeoutError.status = 504;
      timeoutError.upstreamStatus = 504;
      timeoutError.upstreamBody = { error_type: 'timeout', message: 'Request to Hive timed out' };
      throw timeoutError;
    }
    const networkError = new Error(`Network failure communicating with Hive API (${err.cause?.code || err.cause?.message || err.message})`);
    networkError.status = 502;
    networkError.upstreamStatus = 502;
    networkError.upstreamBody = { error_type: 'network_failure', details: err.cause?.message || err.message };
    throw networkError;
  } finally {
    clearTimeout(timeoutId);
  }

  // Parse response body safely
  const rawText = await response.text();
  let responseData;
  try {
    responseData = JSON.parse(rawText);
  } catch {
    responseData = { rawText };
  }

  const sanitizedData = sanitizeHiveResponse(responseData);

  // Handle non-2xx responses with detailed, sanitized diagnostic information
  if (!response.ok) {
    const upstreamMsg = sanitizedData?.message || sanitizedData?.error || sanitizedData?.error_code || rawText.slice(0, 200);

    // Log diagnostic information on server only (never log API keys)
    console.error(`[HiveService] Upstream HTTP ${response.status} from ${endpoint}:`, JSON.stringify(sanitizedData));

    let userFacingMessage;
    if (response.status === 400) {
      userFacingMessage = `Hive rejected the request (HTTP 400 Bad Request): ${upstreamMsg}`;
    } else if (response.status === 401 || response.status === 403) {
      userFacingMessage = `Hive authentication/configuration error (HTTP ${response.status}): ${upstreamMsg}`;
    } else if (response.status === 429) {
      userFacingMessage = `Hive API rate limit exceeded (HTTP 429): ${upstreamMsg}`;
    } else if (response.status >= 500) {
      userFacingMessage = `Hive service error (HTTP ${response.status}): ${upstreamMsg}`;
    } else {
      userFacingMessage = `Hive API responded with HTTP ${response.status}: ${upstreamMsg}`;
    }

    const error = new Error(userFacingMessage);
    error.status = response.status;
    error.upstreamStatus = response.status;
    error.upstreamBody = sanitizedData;
    throw error;
  }

  // Extract classification output from successful response
  const { classes, algorithmicTags } = extractClassesAndTags(responseData);

  if (!classes || !Array.isArray(classes)) {
    console.error('[HiveService] Unexpected response structure without classification outputs:', sanitizedData);
    const err = new Error('Hive API returned an unexpected response structure without classification outputs.');
    err.status = 502;
    err.upstreamStatus = 200;
    err.upstreamBody = sanitizedData;
    throw err;
  }

  let aiGeneratedScore = null;
  let notAiGeneratedScore = null;
  let deepfakeScore = null;
  const sourceScores = [];

  const nonSourceClasses = ['ai_generated', 'not_ai_generated', 'deepfake', 'none', 'inconclusive', 'inconclusive_video'];

  for (const item of classes) {
    if (!item || typeof item !== 'object') continue;
    const cls = (item.class || '').toLowerCase();
    const rawScore = typeof item.score === 'number' ? item.score : parseFloat(item.score);
    if (isNaN(rawScore)) continue;

    if (cls === 'ai_generated') {
      aiGeneratedScore = rawScore;
    } else if (cls === 'not_ai_generated') {
      notAiGeneratedScore = rawScore;
    } else if (cls === 'deepfake') {
      deepfakeScore = rawScore;
    } else if (!nonSourceClasses.includes(cls)) {
      sourceScores.push({
        source: item.class,
        score: rawScore
      });
    }
  }

  // Sort source models descending by score
  sourceScores.sort((a, b) => b.score - a.score);

  // Identify likely generative source if evidence exists (> 5% confidence and not empty)
  let likelySource = null;
  let sourceConfidence = null;
  if (sourceScores.length > 0 && sourceScores[0].score >= 0.05) {
    likelySource = sourceScores[0].source;
    sourceConfidence = roundScore(sourceScores[0].score);
  }

  // Extract C2PA metadata if present
  let c2pa = null;
  if (algorithmicTags?.c2pa && typeof algorithmicTags.c2pa === 'object') {
    const entries = Object.entries(algorithmicTags.c2pa).filter(([_, val]) => val && String(val).trim().length > 0);
    if (entries.length > 0) {
      c2pa = Object.fromEntries(entries);
    }
  }

  // Compute cautious, transparent verdict using Hive's recommended ~0.9 threshold
  const verdictObj = computeVerdict(aiGeneratedScore, notAiGeneratedScore, deepfakeScore);

  const topSources = sourceScores.slice(0, 5).map(s => ({
    source: s.source,
    score: roundScore(s.score)
  }));

  return {
    success: true,
    provider: 'Hive',
    file: {
      name: fileMeta.name || 'image',
      size: fileMeta.size || 0,
      type: fileMeta.type || 'image/jpeg'
    },
    analysis: {
      verdict: verdictObj.verdict,
      verdictType: verdictObj.verdictType,
      verdictDescription: verdictObj.verdictDescription,
      aiGeneratedProbability: roundScore(aiGeneratedScore),
      notAiGeneratedProbability: roundScore(notAiGeneratedScore),
      deepfakeProbability: roundScore(deepfakeScore),
      likelySource,
      sourceConfidence,
      topSources,
      c2pa,
      analyzedAt: new Date().toISOString()
    },
    raw: {
      classes: classes.slice(0, 30),
      algorithmic_tags: algorithmicTags || null
    }
  };
}

export default {
  analyzeImageWithHiveUrl,
  computeVerdict,
  roundScore,
  extractClassesAndTags,
  sanitizeHiveResponse
};
