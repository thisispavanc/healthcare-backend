const AuthService = require('../services/AuthService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

class AuthController {
  // Register new user (Admin only)
  register = asyncHandler(async (req, res) => {
    const adminUserId = req.user.userId;
    const userData = req.body;
    
    const newUser = await AuthService.register(userData, adminUserId);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  });

  // Login user
  login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    const result = await AuthService.login(username, password);
    
    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  });

  // Refresh access token
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const cookieRefreshToken = req.cookies?.refreshToken;
    
    const tokenToUse = refreshToken || cookieRefreshToken;
    
    if (!tokenToUse) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    const result = await AuthService.refreshToken(tokenToUse);
    
    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken
      }
    });
  });

  // Logout user
  logout = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    
    await AuthService.logout(userId);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });

  // Get current user profile
  getProfile = asyncHandler(async (req, res) => {
    const UserModel = require('../models/UserModel');
    const user = await UserModel.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { password_hash, refresh_token, ...userProfile } = user;
    
    res.json({
      success: true,
      data: userProfile
    });
  });
}

module.exports = new AuthController();