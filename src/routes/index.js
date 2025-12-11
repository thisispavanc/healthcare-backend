const express = require('express');

// Import route modules
const authRoutes = require('./auth');
const patientRoutes = require('./patients');
const addressRoutes = require('./addresses');
const visitRoutes = require('./visits');
const auditRoutes = require('./audit');
const { 
  contactRouter, 
  insuranceRouter, 
  observationRouter, 
  allergyRouter, 
  medicationRouter 
} = require('./other');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PAA Healthcare API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API version and info
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'PAA Healthcare API',
      version: '1.0.0',
      description: 'Healthcare application backend for patient data management',
      endpoints: {
        auth: '/api/auth',
        patients: '/api/patients',
        addresses: '/api/addresses',
        contacts: '/api/contacts',
        insurances: '/api/insurances',
        visits: '/api/visits',
        observations: '/api/observations',
        allergies: '/api/allergies',
        medications: '/api/medications',
        audit: '/api/audit'
      }
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/addresses', addressRoutes);
router.use('/contacts', contactRouter);
router.use('/insurances', insuranceRouter);
router.use('/visits', visitRoutes);
router.use('/observations', observationRouter);
router.use('/allergies', allergyRouter);
router.use('/medications', medicationRouter);
router.use('/audit', auditRoutes);

module.exports = router;