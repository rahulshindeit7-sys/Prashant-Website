import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';
import previewRouter from './routes/preview.js';
import publishRouter from './routes/publish.js';
import uploadsRouter from './routes/uploads.js';
import publicRouter from './routes/public.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5050;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

// Compression middleware (gzip compression for faster response times)
app.use(compression({
  level: 6,  // Balance between compression ratio and CPU usage (0-9)
  threshold: 1024,  // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress uploads (already compressed)
    if (req.path.startsWith('/uploads')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Session middleware
const sessionStore = new (FileStore(session))({
  dir: path.join(__dirname, 'sessions'),
  ttl: 28800, // 8 hours
  encoding: 'utf8'
});

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  },
  name: 'cms_session'
}));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API routes
// Public routes (no auth required)
app.use('/api', publicRouter);

// Authenticated routes
app.use('/api', authRouter);
app.use('/api', contentRouter);
app.use('/api', previewRouter);
app.use('/api', publishRouter);
app.use('/api', uploadsRouter);

// Serve admin panel frontend (SPA fallback)
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'CMS running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    ok: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Doctor CMS server running on port ${port}`);
  console.log(`Admin panel: http://localhost:${port}/admin/login`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
