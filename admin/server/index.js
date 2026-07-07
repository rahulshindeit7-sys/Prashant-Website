const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
const sitesRouter = require('./routes/sites');
const configRouter = require('./routes/config');
const healthRouter = require('./routes/health');
const logsRouter = require('./routes/logs');
const feedbackRouter = require('./routes/feedback');

app.use('/api/sites', healthRouter); // refresh endpoint is under /api/sites/refresh
app.use('/api/sites', sitesRouter);
app.use('/api/sites', configRouter);
app.use('/api/logs', logsRouter);
app.use('/api/feedback', feedbackRouter);

// Fallback to index.html for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin dashboard running at http://localhost:${PORT}`);
});

module.exports = app;
