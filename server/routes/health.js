import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());

  res.status(200).json({
    status: 'ok',
    service: 'TruthShield API',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    features: {
      imageAnalysis: 'gemini_multimodal_active',
      videoAnalysis: 'planned_phase_3',
      audioAnalysis: 'planned_phase_3',
      geminiIntegration: hasGeminiKey ? 'active' : 'pending_key',
      geminiModel: (process.env.GEMINI_MODEL || 'gemini-3.5-flash').trim(),
      sourceVerification: 'planned_phase_3'
    }
  });
});

export default router;
