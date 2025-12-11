const BaseModel = require('./BaseModel');

class AuditLogModel extends BaseModel {
  constructor() {
    super('audit_logs');
  }

  // Log an audit entry
  async logAction(tableName, recordId, action, changedData, performedBy) {
    return this.create({
      table_name: tableName,
      record_id: recordId,
      action: action.toUpperCase(),
      changed_data: changedData,
      performed_by: performedBy
    });
  }

  // Get audit logs by table and record
  async getByRecord(tableName, recordId, options = {}) {
    return this.findAll({ 
      table_name: tableName, 
      record_id: recordId 
    }, { 
      ...options, 
      orderBy: 'performed_at', 
      order: 'desc' 
    });
  }

  // Get audit logs by user
  async getByUser(performedBy, options = {}) {
    return this.findAll({ performed_by: performedBy }, options);
  }
}

module.exports = new AuditLogModel();