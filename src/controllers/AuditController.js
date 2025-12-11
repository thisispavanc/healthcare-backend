const AuditLogModel = require('../models/AuditLogModel');
const { asyncHandler } = require('../middleware/errorHandler');

class AuditController {
  // Get all audit logs (Admin only)
  getAuditLogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, table_name, performed_by } = req.query;
    
    const filters = {};
    if (table_name) filters.table_name = table_name;
    if (performed_by) filters.performed_by = performed_by;
    
    const result = await AuditLogModel.findAll(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      orderBy: 'performed_at',
      order: 'desc'
    });
    
    res.json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get audit logs for specific record
  getRecordAuditLogs = asyncHandler(async (req, res) => {
    const { tableName, recordId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await AuditLogModel.getByRecord(tableName, recordId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      message: 'Record audit logs retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get audit logs by user
  getUserAuditLogs = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await AuditLogModel.getByUser(username, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      message: 'User audit logs retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });
}

module.exports = new AuditController();