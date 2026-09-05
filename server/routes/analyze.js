import express from 'express';
import multer from 'multer';
import geminiService from '../services/geminiService.js';

const router = express.Router();

function isValidImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  // WEBP: 'RIFF' .... 'WEBP'
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;
  return false;
}

// Memory storage — image is passed directly as a Buffer to Gemini (no temp URL needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB max
  }
}).fields([
  { name: 'media', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const VIDEO_AUDIO_TYPES = ['video/mp4', 'video/webm', 'audio/mpeg', 'audio/mp3', 'audio/wav'];

/**
 * POST /api/analyze
 * Receives an uploaded image and runs Gemini multimodal analysis on it.
 */
router.post('/analyze', (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds the 20MB limit. Please upload a smaller image.'
        });
      }
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const uploadedFile = req.files?.media?.[0] || req.files?.image?.[0] || req.files?.file?.[0] || req.file;

    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        error: 'No media file provided. Please upload an image to analyze.'
      });
    }

    const { originalname, mimetype, buffer, size } = uploadedFile;

    // Intercept video/audio — planned for Phase 3
    if (VIDEO_AUDIO_TYPES.includes(mimetype)) {
      return res.status(422).json({
        success: false,
        error: 'Audio and video analysis is planned for Phase 3. Please upload an image (JPG, PNG, WEBP) for current verification.',
        file: { name: originalname, type: mimetype, size }
      });
    }

    // Validate image MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported file format (${mimetype}). TruthShield accepts JPG, PNG, and WEBP images.`
      });
    }

    // Validate binary magic bytes to prevent MIME type spoofing
    if (!isValidImageMagicBytes(buffer)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image content. The uploaded file does not contain valid JPEG, PNG, or WEBP binary headers.'
      });
    }

    // Guard: ensure GEMINI_API_KEY is configured
    if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to the .env file.'
      });
    }

    // Pass buffer directly to Gemini (no URL or media transport needed)
    const result = await geminiService.analyzeImageWithGemini(buffer, mimetype, originalname);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error in /api/analyze route:', err.message);

    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: err.message || 'An unexpected error occurred during media verification.'
    });
  }
});

export default router;
