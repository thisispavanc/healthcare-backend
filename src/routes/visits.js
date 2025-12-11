const express = require('express');
const VisitController = require('../controllers/VisitController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../validation/middleware');
const { visitSchemas, commonSchemas } = require('../validation/schemas');
const { auditLog } = require('../middleware/audit');

const router = express.Router();

/**
 * @route   GET /api/visits/patient/:patientId
 * @desc    Get visits by patient ID
 * @access  Private (All roles)
 */
router.get('/patient/:patientId',
  authenticate,
  VisitController.getVisitsByPatient
);

/**
 * @route   GET /api/visits/:id
 * @desc    Get visit with observations
 * @access  Private (All roles)
 */
router.get('/:id',
  authenticate,
  validate(commonSchemas.uuid, 'params'),
  VisitController.getVisit
);

/**
 * @route   POST /api/visits
 * @desc    Create new visit
 * @access  Private (Clinician, Admin)
 */
router.post('/',
  authenticate,
  authorize('clinician'),
  validate(visitSchemas.create),
  auditLog('visits', 'CREATE'),
  VisitController.createVisit
);

/**
 * @route   PUT /api/visits/:id
 * @desc    Update visit
 * @access  Private (Clinician, Admin)
 */
router.put('/:id',
  authenticate,
  authorize('clinician'),
  validate(commonSchemas.uuid, 'params'),
  validate(visitSchemas.update),
  auditLog('visits', 'UPDATE'),
  VisitController.updateVisit
);

/**
 * @route   DELETE /api/visits/:id
 * @desc    Delete visit
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticate,
  authorize('admin'),
  validate(commonSchemas.uuid, 'params'),
  auditLog('visits', 'DELETE'),
  VisitController.deleteVisit
);

module.exports = router;