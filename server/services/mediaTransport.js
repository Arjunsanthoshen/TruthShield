import crypto from 'crypto';

/**
 * In-memory temporary media store for local development.
 * Designed as a modular transport layer that can easily be swapped
 * with S3, Cloudinary, or GCS object storage in production.
 */
const mediaStore = new Map();
const TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

// Periodic cleanup of stale media
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of mediaStore.entries()) {
    if (now - item.createdAt > TTL_MS) {
      mediaStore.delete(id);
    }
  }
}, 60 * 1000).unref();

/**
 * Store an uploaded image buffer temporarily
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @param {string} filename
 * @returns {string} mediaId
 */
export function storeTemporaryMedia(buffer, mimeType, filename) {
  const mediaId = crypto.randomBytes(16).toString('hex');
  mediaStore.set(mediaId, {
    buffer,
    mimeType,
    filename: filename || `media-${mediaId}`,
    createdAt: Date.now()
  });
  return mediaId;
}

/**
 * Retrieve temporary media by ID
 * @param {string} mediaId
 * @returns {{ buffer: Buffer, mimeType: string, filename: string } | null}
 */
export function getTemporaryMedia(mediaId) {
  return mediaStore.get(mediaId) || null;
}

/**
 * Remove temporary media by ID
 * @param {string} mediaId
 */
export function removeTemporaryMedia(mediaId) {
  mediaStore.delete(mediaId);
}

/**
 * Resolve a media URL for Hive API submission.
 * - If PUBLIC_MEDIA_URL_BASE or PUBLIC_BASE_URL is set (e.g. ngrok/Cloudflare tunnel or public domain), uses that.
 * - Otherwise constructs URL from the incoming request (local development).
 *
 * @param {string} mediaId
 * @param {import('express').Request} [req]
 * @returns {string} Fully qualified media URL
 */
export function resolveMediaUrl(mediaId, req) {
  const publicBase = process.env.PUBLIC_MEDIA_URL_BASE || process.env.PUBLIC_BASE_URL;
  if (publicBase) {
    return `${publicBase.replace(/\/+$/, '')}/api/media/${mediaId}`;
  }

  const protocol = req?.headers['x-forwarded-proto'] || req?.protocol || 'http';
  const host = req?.get ? req.get('host') : (req?.headers?.host || 'localhost:5000');
  const resolvedUrl = `${protocol}://${host}/api/media/${mediaId}`;

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    console.info(`[MediaTransport] Localhost URL generated: ${resolvedUrl}. Note: Cloud services (like Hive) require a publicly accessible URL to fetch media if not tunneled.`);
  }

  return resolvedUrl;
}

export default {
  storeTemporaryMedia,
  getTemporaryMedia,
  removeTemporaryMedia,
  resolveMediaUrl
};
