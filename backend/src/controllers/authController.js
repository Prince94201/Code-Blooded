const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiry
  });
};

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
