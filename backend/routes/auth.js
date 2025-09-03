const express = require('express');
const crypto = require('crypto');
const Tourist = require('../models/Tourist');
const Authority = require('../models/Authority');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Tourist Registration
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, phone, password, 
      idProof, nationality,
      startDate, endDate, plannedRoute,
      emergencyContacts
    } = req.body;

    // Check if tourist already exists
    const existingTourist = await Tourist.findOne({ email });
    if (existingTourist) {
      return res.status(400).json({ error: 'Tourist already registered with this email' });
    }

    // Hash ID proof for privacy
    const idProofHash = crypto.createHash('sha256').update(idProof).digest('hex');

    // Create tourist
    const tourist = new Tourist({
      name,
      email,
      phone,
      password,
      idProofHash,
      nationality,
      tripDetails: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        plannedRoute: plannedRoute || [],
        accommodations: []
      },
      emergencyContacts: emergencyContacts || []
    });

    await tourist.save();

    // Generate blockchain hash (simplified)
    tourist.blockchainHash = crypto.createHash('sha256')
      .update(tourist.digitalId + tourist.idProofHash)
      .digest('hex');
    await tourist.save();

    // Generate JWT token
    const token = generateToken({
      id: tourist._id,
      digitalId: tourist.digitalId,
      type: 'tourist'
    });

    res.status(201).json({
      message: 'Tourist registered successfully',
      digitalId: tourist.digitalId,
      token,
      tourist: {
        id: tourist._id,
        name: tourist.name,
        digitalId: tourist.digitalId,
        email: tourist.email,
        safetyScore: tourist.safetyScore,
        tripStatus: tourist.tripStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Tourist Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find tourist
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await tourist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!tourist.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Update last seen
    tourist.lastSeen = new Date();
    await tourist.save();

    // Generate token
    const token = generateToken({
      id: tourist._id,
      digitalId: tourist.digitalId,
      type: 'tourist'
    });

    res.json({
      message: 'Login successful',
      token,
      tourist: {
        id: tourist._id,
        name: tourist.name,
        digitalId: tourist.digitalId,
        email: tourist.email,
        safetyScore: tourist.safetyScore,
        tripStatus: tourist.tripStatus,
        currentLocation: tourist.currentLocation
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Authority Login
router.post('/authority-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find authority
    const authority = await Authority.findOne({ email });
    if (!authority) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await authority.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!authority.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Update last login
    authority.lastLogin = new Date();
    await authority.save();

    // Generate token
    const token = generateToken({
      id: authority._id,
      badgeNumber: authority.badgeNumber,
      type: 'authority'
    });

    res.json({
      message: 'Authority login successful',
      token,
      authority: {
        id: authority._id,
        name: authority.name,
        badgeNumber: authority.badgeNumber,
        department: authority.department,
        rank: authority.rank,
        station: authority.station,
        permissions: authority.permissions,
        isOnDuty: authority.isOnDuty
      }
    });
  } catch (error) {
    console.error('Authority login error:', error);
    res.status(500).json({ error: 'Authority login failed' });
  }
});

// Verify Digital ID
router.get('/verify-digital-id/:digitalId', async (req, res) => {
  try {
    const { digitalId } = req.params;

    const tourist = await Tourist.findOne({ digitalId }).select('-password -idProofHash');
    if (!tourist) {
      return res.status(404).json({ error: 'Digital ID not found' });
    }

    res.json({
      valid: true,
      tourist: {
        digitalId: tourist.digitalId,
        name: tourist.name,
        nationality: tourist.nationality,
        tripStatus: tourist.tripStatus,
        safetyScore: tourist.safetyScore,
        isActive: tourist.isActive,
        tripDetails: {
          startDate: tourist.tripDetails.startDate,
          endDate: tourist.tripDetails.endDate
        }
      },
      verificationTime: new Date()
    });
  } catch (error) {
    console.error('Digital ID verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Create demo authority (for hackathon)
router.post('/create-demo-authority', async (req, res) => {
  try {
    // Check if demo authority already exists
    let authority = await Authority.findOne({ badgeNumber: 'DEMO001' });
    if (authority) {
      return res.json({ message: 'Demo authority already exists', authority: { badgeNumber: authority.badgeNumber } });
    }

    // Create demo authority
    authority = new Authority({
      badgeNumber: 'DEMO001',
      name: 'Demo Police Officer',
      email: 'demo@police.gov',
      password: 'demo123',
      department: 'police',
      rank: 'Inspector',
      station: 'Central Station',
      phone: '+91-9999999999',
      jurisdiction: {
        areas: ['Central District', 'Tourist Area'],
      },
      isOnDuty: true,
      permissions: ['view_alerts', 'acknowledge_alerts', 'resolve_alerts', 'view_tourists', 'access_dashboard']
    });

    await authority.save();

    res.json({ 
      message: 'Demo authority created successfully',
      credentials: {
        email: 'demo@police.gov',
        password: 'demo123',
        badgeNumber: 'DEMO001'
      }
    });
  } catch (error) {
    console.error('Demo authority creation error:', error);
    res.status(500).json({ error: 'Failed to create demo authority' });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', (req, res) => {
  // In a more complex system, we might blacklist the token
  res.json({ message: 'Logout successful' });
});

module.exports = router;