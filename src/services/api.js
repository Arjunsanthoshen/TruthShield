/**
 * TruthShield Frontend API Client
 * Centralized service module for backend communication.
 */

const API_BASE = '/api';

/**
 * Check backend service health status
 * @returns {Promise<{ status: string, service: string, version: string, uptime: number, features: object }>}
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('TruthShield API health check unreachable:', error.message);
    return {
      status: 'offline',
      error: error.message
    };
  }
}

/**
 * Submit media file for verification pipeline
 * @param {File} file - Image file to verify
 * @param {Function} [onProgress] - Optional upload progress callback
 * @returns {Promise<{ success: boolean, message: string, file?: object, error?: string }>}
 */
export async function analyzeMedia(file, _onProgress) {
  if (!file) {
    throw new Error('Please select a file to analyze.');
  }

  const formData = new FormData();
  formData.append('media', file);

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.error || `Upload failed with status ${response.status}`);
      err.upstreamStatus = data.upstreamStatus;
      err.upstreamBody = data.upstreamBody;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('API Error analyzeMedia:', error);
    throw error;
  }
}

/**
 * Future integration stub: Ask TruthShield Gemini explainer
 * @param {string} prompt - User question or query
 * @param {object} [mediaContext] - Metadata or hash of analyzed media
 */
export async function askTruthShield(prompt, mediaContext = {}) {
  // To be integrated in Phase 3 with Gemini
  console.info('askTruthShield invoked with prompt:', prompt, mediaContext);
  return {
    status: 'pending_phase_3',
    response: 'Gemini reasoning assistant will be active in Phase 3.'
  };
}
