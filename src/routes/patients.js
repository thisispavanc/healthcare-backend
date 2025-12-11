const express = require('express');
const PatientController = require('../controllers/PatientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../validation/middleware');
const { patientSchemas, commonSchemas } = require('../validation/schemas');
const { auditLog } = require('../middleware/audit');

const router = express.Router();

/**
 * @route   GET /api/patients
 * @desc    Get all patients with pagination and search
 * @access  Private (All roles)
 */
router.get('/',
  authenticate,
  PatientController.getPatients
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private (All roles)
 */
router.get('/:id',
  authenticate,
  validate(commonSchemas.uuid, 'params'),
  PatientController.getPatient
);

/**
 * @route   GET /api/patients/:id/details
 * @desc    Get patient with all related data
 * @access  Private (All roles)
 */
router.get('/:id/details',
  authenticate,
  validate(commonSchemas.uuid, 'params'),
  PatientController.getPatientWithDetails
);

/**
 * @route   POST /api/patients
 * @desc    Create new patient
 * @access  Private (Clinician, Admin)
 */
router.post('/',
  authenticate,
  authorize('clinician'),
  validate(patientSchemas.create),
  auditLog('patients', 'CREATE'),
  PatientController.createPatient
);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient
 * @access  Private (Clinician, Admin)
 */
router.put('/:id',
  authenticate,
  authorize('clinician'),
  validate(commonSchemas.uuid, 'params'),
  validate(patientSchemas.update),
  auditLog('patients', 'UPDATE'),
  PatientController.updatePatient
);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticate,
  authorize('admin'),
  validate(commonSchemas.uuid, 'params'),
  auditLog('patients', 'DELETE'),
  PatientController.deletePatient
);

module.exports = router;