const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized to access this route' 
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Not authorized to access this route' 
    });
  }
};

// Middleware to restrict access by role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
