const AuditLogModel = require('../models/AuditLogModel');
const logger = require('../config/logger');

// Audit logging middleware
const auditLog = (tableName, action) => {
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override res.json to capture response
    res.json = function(data) {
      // Call original method first
      originalJson.call(this, data);
      
      // Log audit entry if operation was successful
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          let recordId = null;
          let changedData = {};
          
          // Extract record ID and data based on action
          switch (action.toUpperCase()) {
            case 'CREATE':
              recordId = data.data?.id || data.id;
              changedData = req.body;
              break;
            case 'UPDATE':
              recordId = req.params.id;
              changedData = req.body;
              break;
            case 'DELETE':
              recordId = req.params.id;
              changedData = { deleted: true };
              break;
            default:
              return; // Don't log READ operations
          }
          
          if (recordId) {
            // Asynchronously log audit entry
            AuditLogModel.logAction(
              tableName,
              recordId,
              action,
              changedData,
              req.user.username || req.user.userId
            ).catch(error => {
              logger.error('Audit logging failed:', error);
            });
          }
        } catch (error) {
          logger.error('Audit middleware error:', error);
        }
      }
    };
    
    next();
  };
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user?.username || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.error('Request failed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

module.exports = {
  auditLog,
  requestLogger
};