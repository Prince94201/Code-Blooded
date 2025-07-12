const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};
