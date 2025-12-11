const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const UserModel = require('../models/UserModel');
const logger = require('../config/logger');

class AuthService {
  // Generate Access Token
  generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'paa-healthcare',
      audience: 'paa-users'
    });
  }

  // Generate Refresh Token
  generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'paa-healthcare',
      audience: 'paa-users'
    });
  }

  // Verify Access Token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, {
        issuer: 'paa-healthcare',
        audience: 'paa-users'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify Refresh Token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'paa-healthcare',
        audience: 'paa-users'
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Hash Password
  async hashPassword(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare Password
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Register User (Admin only)
  async register(userData, adminUserId) {
    const { username, email, password, first_name, last_name, role = 'read-only' } = userData;

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username) || await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this username or email');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      role,
      is_active: true
    });

    logger.info(`User registered: ${username} by admin: ${adminUserId}`);

    // Remove sensitive data
    const { password_hash, refresh_token, ...userResponse } = newUser;
    return userResponse;
  }

  // Login User
  async login(username, password) {
    // Find user by username or email
    const user = await UserModel.findByUsername(username) || await UserModel.findByEmail(username);
    
    if (!user || !user.is_active) {
      throw new Error('Invalid credentials or account disabled');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      jti: uuidv4() // Unique token ID
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken({ 
      userId: user.id, 
      jti: tokenPayload.jti 
    });

    // Save refresh token
    await UserModel.updateRefreshToken(user.id, refreshToken);
    await UserModel.updateLastLogin(user.id);

    logger.info(`User logged in: ${username}`);

    // Remove sensitive data
    const { password_hash, refresh_token, ...userResponse } = user;

    return {
      user: userResponse,
      accessToken,
      refreshToken
    };
  }

  // Refresh Token
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Find user and verify refresh token
      const user = await UserModel.findByRefreshToken(refreshToken);
      if (!user || !user.is_active || user.id !== decoded.userId) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        jti: decoded.jti // Keep same jti for token rotation
      };

      const newAccessToken = this.generateAccessToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken({ 
        userId: user.id, 
        jti: decoded.jti 
      });

      // Update refresh token
      await UserModel.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout User
  async logout(userId) {
    await UserModel.updateRefreshToken(userId, null);
    logger.info(`User logged out: ${userId}`);
  }

  // Validate User Permissions
  hasPermission(userRole, requiredRole) {
    const roleHierarchy = {
      'read-only': 0,
      'clinician': 1,
      'admin': 2
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}

module.exports = new AuthService();