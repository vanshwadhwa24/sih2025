const jwt = require('jsonwebtoken');
const Tourist = require('../models/Tourist');
const Authority = require('../models/Authority');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Tourist authentication middleware
const authenticateTourist = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'authority') {
      return res.status(401).json({ error: 'Invalid token type.' });
    }

    const authority = await Authority.findById(decoded.id).select('-password');
    if (!authority) {
      return res.status(401).json({ error: 'Authority not found.' });
    }

    if (!authority.isActive) {
      return res.status(401).json({ error: 'Account is inactive.' });
    }

    req.authority = authority;
    next();
  } catch (error) {
    console.error('Authority auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Check specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.authority) {
      return res.status(401).json({ error: 'Authority authentication required.' });
    }

    if (!req.authority.hasPermission(permission)) {
      return res.status(403).json({ error: `Permission '${permission}' required.` });
    }

    next();
  };
};

// Flexible auth - allows either tourist or authority
const authenticateAny = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    
    if (decoded.type === 'tourist') {
      const tourist = await Tourist.findById(decoded.id).select('-password');
      if (tourist && tourist.isActive && tourist.isTripActive()) {
        req.tourist = tourist;
        req.userType = 'tourist';
        return next();
      }
    } else if (decoded.type === 'authority') {
      const authority = await Authority.findById(decoded.id).select('-password');
      if (authority && authority.isActive) {
        req.authority = authority;
        req.userType = 'authority';
        return next();
      }
    }

    res.status(401).json({ error: 'Invalid or expired token.' });
  } catch (error) {
    console.error('Flexible auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateTourist,
  authenticateAuthority,
  requirePermission,
  authenticateAny
};

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'tourist') {
      return res.status(401).json({ error: 'Invalid token type.' });
    }

    const tourist = await Tourist.findById(decoded.id).select('-password');
    if (!tourist) {
      return res.status(401).json({ error: 'Tourist not found.' });
    }

    if (!tourist.isActive) {
      return res.status(401).json({ error: 'Account is inactive.' });
    }

    // Check if trip is still valid
    if (!tourist.isTripActive()) {
      return res.status(401).json({ error: 'Trip period has expired.' });
    }

    req.tourist = tourist;
    next();
  } catch (error) {
    console.error('Tourist auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Authority authentication middleware
const authenticateAuthority = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }