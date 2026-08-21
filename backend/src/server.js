require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { seedDatabase } = require('./utils/seedData');
const routes = require('./routes');

// Run initial seed if database is empty
seedDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static frontend build if available (Production SPA Support)
const fs = require('fs');
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Root info in API-only mode
  app.get('/', (req, res) => {
    res.json({
      name: 'Blend Coffee & Tea Management API',
      version: '1.0.0',
      endpoints: {
        stats: '/api/stats/overview',
        products: '/api/products',
        orders: '/api/orders',
        inventory: '/api/inventory',
        customers: '/api/customers',
        promotions: '/api/promotions',
        staff: '/api/staff',
        reports: '/api/reports/summary'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`☕ Blend Backend Server is running at http://localhost:${PORT}`);
});

module.exports = app;
