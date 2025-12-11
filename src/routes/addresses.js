const express = require('express');
const AddressController = require('../controllers/AddressController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../validation/middleware');
const { addressSchemas, commonSchemas } = require('../validation/schemas');
const { auditLog } = require('../middleware/audit');

const router = express.Router();

/**
 * @route   GET /api/addresses/patient/:patientId
 * @desc    Get addresses by patient ID
 * @access  Private (All roles)
 */
router.get('/patient/:patientId',
  authenticate,
  AddressController.getAddressesByPatient
);

/**
 * @route   POST /api/addresses
 * @desc    Create new address
 * @access  Private (Clinician, Admin)
 */
router.post('/',
  authenticate,
  authorize('clinician'),
  validate(addressSchemas.create),
  auditLog('addresses', 'CREATE'),
  AddressController.createAddress
);

/**
 * @route   PUT /api/addresses/:id
 * @desc    Update address
 * @access  Private (Clinician, Admin)
 */
router.put('/:id',
  authenticate,
  authorize('clinician'),
  validate(commonSchemas.uuid, 'params'),
  validate(addressSchemas.update),
  auditLog('addresses', 'UPDATE'),
  AddressController.updateAddress
);

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Delete address
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticate,
  authorize('admin'),
  validate(commonSchemas.uuid, 'params'),
  auditLog('addresses', 'DELETE'),
  AddressController.deleteAddress
);

module.exports = router;