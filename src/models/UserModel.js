const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // Find user by username
  async findByUsername(username) {
    return this.db(this.tableName).where('username', username).first();
  }

  // Find user by email
  async findByEmail(email) {
    return this.db(this.tableName).where('email', email).first();
  }

  // Update last login
  async updateLastLogin(userId) {
    return this.update(userId, { last_login: new Date() });
  }

  // Update refresh token
  async updateRefreshToken(userId, refreshToken) {
    return this.update(userId, { refresh_token: refreshToken });
  }

  // Find user by refresh token
  async findByRefreshToken(refreshToken) {
    return this.db(this.tableName).where('refresh_token', refreshToken).first();
  }

  // Get active users only
  async getActiveUsers(options = {}) {
    return this.findAll({ is_active: true }, options);
  }
}

module.exports = new UserModel();