import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

// Set test environment before loading server
process.env.NODE_ENV = 'test';

import app from '../server/server.js';
import geminiService from '../server/services/geminiService.js';

describe('TruthShield Backend API Integration Tests', () => {
  let server;
  let baseUrl;

  // Minimal valid 1x1 PNG image with correct magic bytes
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
  ]);

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    mock.reset();
    if (server) {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('1. GET /api/health returns a successful health response', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.service, 'TruthShield API');
    assert.strictEqual(typeof body.version, 'string');
    assert.strictEqual(body.features.imageAnalysis, 'gemini_multimodal_active');
    assert.strictEqual(body.features.videoAnalysis, 'planned_phase_3');
  });

  test('2. POST /api/analyze rejects requests without an image', async () => {
    const emptyForm = new FormData();
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: emptyForm
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.error, /no media file provided/i);
  });

  test('3. POST /api/analyze rejects invalid/non-image MIME types', async () => {
    const form = new FormData();
    const textBlob = new Blob(['Not an image'], { type: 'text/plain' });
    form.append('media', textBlob, 'test.txt');

    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: form
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.error, /unsupported file format/i);
  });

  test('4. POST /api/analyze rejects spoofed non-image content pretending to be an image', async () => {
    const form = new FormData();
    const textBlob = new Blob(['Spoofed content pretending to be PNG'], { type: 'image/png' });
    form.append('media', textBlob, 'spoofed.png');

    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: form
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.error, /invalid image content/i);
  });

  test('5. POST /api/analyze handles deferred video/audio modalities with 422', async () => {
    const form = new FormData();
    const videoBlob = new Blob(['dummy video'], { type: 'video/mp4' });
    form.append('media', videoBlob, 'sample.mp4');

    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: form
    });

    assert.strictEqual(res.status, 422);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.error, /planned for Phase 3/i);
  });

  test('6. POST /api/analyze handles Gemini/API configuration errors safely', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    try {
      // Simulate missing API key
      delete process.env.GEMINI_API_KEY;

      const form = new FormData();
      const pngBlob = new Blob([validPngBuffer], { type: 'image/png' });
      form.append('media', pngBlob, 'valid.png');

      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        body: form
      });

      assert.strictEqual(res.status, 500);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.match(body.error, /Gemini API key is not configured/i);
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  test('7. POST /api/analyze returns expected analysis response structure when mocked', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'mock_test_key_truthshield';

    const mockAnalysis = {
      success: true,
      provider: 'Gemini',
      file: {
        name: 'sample_authentic.png',
        size: validPngBuffer.length,
        type: 'image/png'
      },
      analysis: {
        verdict: 'Likely Authentic',
        confidence: 0.95,
        summary: 'Image shows natural light propagation, consistent edge falloff, and no synthetic diffusion artifacts.',
        signals: [
          {
            name: 'Lighting & Shadows',
            observation: 'Coherent single-source illumination across all objects.',
            impact: 'supports_authentic'
          }
        ],
        visualObservations: [
          'Sensor noise pattern is uniform and continuous.',
          'Natural geometric proportions on anatomical landmarks.'
        ],
        manipulationIndicators: [],
        limitations: [
          'Visual AI detection is probabilistic and can produce false positives and false negatives.',
          'This assessment is based solely on observable visual characteristics and is not definitive proof.'
        ],
        analyzedAt: new Date().toISOString()
      }
    };

    mock.method(geminiService, 'analyzeImageWithGemini', async () => mockAnalysis);

    try {
      const form = new FormData();
      const pngBlob = new Blob([validPngBuffer], { type: 'image/png' });
      form.append('media', pngBlob, 'sample_authentic.png');

      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        body: form
      });

      assert.strictEqual(res.status, 200);
      const body = await res.json();

      assert.strictEqual(body.success, true);
      assert.strictEqual(body.provider, 'Gemini');
      assert.strictEqual(body.file.name, 'sample_authentic.png');
      assert.strictEqual(body.analysis.verdict, 'Likely Authentic');
      assert.strictEqual(body.analysis.confidence, 0.95);
      assert.ok(Array.isArray(body.analysis.signals));
      assert.strictEqual(body.analysis.signals.length, 1);
      assert.strictEqual(body.analysis.signals[0].impact, 'supports_authentic');
      assert.ok(Array.isArray(body.analysis.visualObservations));
      assert.ok(Array.isArray(body.analysis.limitations));
      assert.ok(body.analysis.analyzedAt);
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  test('8. POST /api/analyze rejects oversized files exceeding the 20MB limit', async () => {
    const form = new FormData();
    // 20MB + 1KB buffer
    const oversizedBuffer = Buffer.alloc(20 * 1024 * 1024 + 1024);
    const bigBlob = new Blob([oversizedBuffer], { type: 'image/png' });
    form.append('media', bigBlob, 'huge.png');

    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: form
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.error, /exceeds the 20MB limit/i);
  });

  test('9. POST /api/analyze handles Gemini upstream service errors safely without crashing', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'mock_test_key_truthshield';

    mock.method(geminiService, 'analyzeImageWithGemini', async () => {
      const err = new Error('Gemini API error (HTTP 503): Service Unavailable');
      err.status = 502;
      throw err;
    });

    try {
      const form = new FormData();
      const pngBlob = new Blob([validPngBuffer], { type: 'image/png' });
      form.append('media', pngBlob, 'sample.png');

      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        body: form
      });

      assert.strictEqual(res.status, 502);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.match(body.error, /Gemini API error/i);
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  test('10. Responses include standard security headers', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(res.headers.get('x-frame-options'), 'DENY');
    assert.strictEqual(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  });
});
