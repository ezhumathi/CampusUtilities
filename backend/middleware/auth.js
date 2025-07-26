// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// ✅ Middleware to verify token and attach user to request
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password'); // remove password
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// ✅ Middleware to allow only admins
const adminAuth = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied. Admins only.' });
  }
  next();
};

module.exports = {
  auth,
  adminAuth,
};
