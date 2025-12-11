const express = require('express');
const AuditController = require('../controllers/AuditController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/audit
 * @desc    Get all audit logs with filtering
 * @access  Admin only
 */
router.get('/',
  authenticate,
  authorize('admin'),
  AuditController.getAuditLogs
);

/**
 * @route   GET /api/audit/record/:tableName/:recordId
 * @desc    Get audit logs for specific record
 * @access  Private (Clinician, Admin)
 */
router.get('/record/:tableName/:recordId',
  authenticate,
  authorize('clinician'),
  AuditController.getRecordAuditLogs
);

/**
 * @route   GET /api/audit/user/:username
 * @desc    Get audit logs by user
 * @access  Admin only
 */
router.get('/user/:username',
  authenticate,
  authorize('admin'),
  AuditController.getUserAuditLogs
);

module.exports = router;