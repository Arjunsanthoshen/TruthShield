import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoute from './routes/health.js';
import analyzeRoute from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for development frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', healthRoute);
app.use('/api', analyzeRoute);

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.originalUrl} not found on TruthShield API`
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Failed to start TruthShield API Server on port ${PORT}:`, err.message);
    process.exit(1);
  }
  console.log(`🛡️  TruthShield API Server running on port ${PORT}`);
  console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍  Analyze endpoint: http://localhost:${PORT}/api/analyze`);
});

server.on('error', (err) => {
  console.error(`❌ TruthShield API Server error:`, err.message);
  process.exit(1);
});

export default app;
