const db = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  // Get all records with optional filters
  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 20, orderBy = 'created_at', order = 'desc' } = options;
    const offset = (page - 1) * limit;

    let query = this.db(this.tableName);

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        if (typeof filters[key] === 'string' && key.includes('name')) {
          query = query.whereILike(key, `%${filters[key]}%`);
        } else {
          query = query.where(key, filters[key]);
        }
      }
    });

    // Get total count for pagination
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');
    const total = parseInt(count);

    // Apply pagination and ordering
    const data = await query
      .orderBy(orderBy, order)
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Find by ID
  async findById(id) {
    return this.db(this.tableName).where('id', id).first();
  }

  // Create new record
  async create(data) {
    const [record] = await this.db(this.tableName).insert(data).returning('*');
    return record;
  }

  // Update record by ID
  async update(id, data) {
    const updatedData = { ...data, updated_at: new Date() };
    const [record] = await this.db(this.tableName)
      .where('id', id)
      .update(updatedData)
      .returning('*');
    return record;
  }

  // Delete record by ID
  async delete(id) {
    return this.db(this.tableName).where('id', id).del();
  }

  // Soft delete (if table has deleted_at column)
  async softDelete(id) {
    return this.update(id, { deleted_at: new Date() });
  }

  // Check if record exists
  async exists(id) {
    const record = await this.db(this.tableName).where('id', id).first();
    return !!record;
  }
}

module.exports = BaseModel;