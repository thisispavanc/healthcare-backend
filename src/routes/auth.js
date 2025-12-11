const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../validation/middleware');
const { userSchemas } = require('../validation/schemas');
const { auditLog } = require('../middleware/audit');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user (Admin only)
 * @access  Admin
 */
router.post('/register', 
  authenticate,
  authorize('admin'),
  validate(userSchemas.register),
  auditLog('users', 'CREATE'),
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  validate(userSchemas.login),
  AuthController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  validate(userSchemas.refreshToken),
  AuthController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticate,
  AuthController.logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile',
  authenticate,
  AuthController.getProfile
);

module.exports = router;