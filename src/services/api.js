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
 * Fast client-side image optimizer for oversized files.
 * Scales down images larger than 1600px or > 1.5MB to avoid sluggish network transfers.
 * Falls back safely to original file if canvas is unavailable or if file is already compact.
 * @param {File} file
 * @returns {Promise<File|Blob>}
 */
async function optimizeImageForUpload(file) {
  if (typeof window === 'undefined' || !file || !file.type?.startsWith('image/')) {
    return file;
  }
  // Skip SVG/GIF or already compact files (<1.5MB)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml' || file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX_DIM = 1600;
        let { width, height } = img;

        if (width <= MAX_DIM && height <= MAX_DIM && file.size <= 2 * 1024 * 1024) {
          resolve(file);
          return;
        }

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type;

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: outputType,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          outputType,
          0.85
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
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

  const payloadFile = await optimizeImageForUpload(file);

  const formData = new FormData();
  formData.append('media', payloadFile);

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
