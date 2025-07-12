const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const swapRoutes = require('./routes/swapRoutes');
const redemptionRoutes = require('./routes/redemptionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logger
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/redeem', redemptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to ReWear API' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
