const express = require('express');
const geolib = require('geolib');
const Tourist = require('../models/Tourist');
const Zone = require('../models/Zone');
const Alert = require('../models/Alert');
const { authenticateTourist } = require('../middleware/auth');

const router = express.Router();

// All routes require tourist authentication
router.use(authenticateTourist);

// Get tourist profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      tourist: {
        id: req.tourist._id,
        digitalId: req.tourist.digitalId,
        name: req.tourist.name,
        email: req.tourist.email,
        phone: req.tourist.phone,
        nationality: req.tourist.nationality,
        tripDetails: req.tourist.tripDetails,
        emergencyContacts: req.tourist.emergencyContacts,
        currentLocation: req.tourist.currentLocation,
        safetyScore: req.tourist.safetyScore,
        tripStatus: req.tourist.tripStatus,
        lastSeen: req.tourist.lastSeen
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { emergencyContacts, tripDetails } = req.body;

    if (emergencyContacts) {
      req.tourist.emergencyContacts = emergencyContacts;
    }

    if (tripDetails) {
      req.tourist.tripDetails = { ...req.tourist.tripDetails, ...tripDetails };
    }

    await req.tourist.save();

    res.json({
      message: 'Profile updated successfully',
      tourist: req.tourist
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update location
router.post('/location', async (req, res) => {
  try {
    const { longitude, latitude, accuracy } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    // Update current location
    req.tourist.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
      timestamp: new Date(),
      accuracy: accuracy || 10
    };

    // Add to location history (keep last 50 locations)
    req.tourist.locationHistory.push({
      coordinates: [longitude, latitude],
      timestamp: new Date(),
      zone: null // Will be updated by geofencing check
    });

    if (req.tourist.locationHistory.length > 50) {
      req.tourist.locationHistory = req.tourist.locationHistory.slice(-50);
    }

    // Update last seen
    req.tourist.lastSeen = new Date();

    // Check geofencing
    const geoAlert = await checkGeofencing(req.tourist, longitude, latitude);

    // Recalculate safety score
    await calculateSafetyScore(req.tourist, longitude, latitude);

    await req.tourist.save();

    // Emit real-time location update
    if (req.io) {
      req.io.to('authorities').emit('tourist-location', {
        touristId: req.tourist._id,
        digitalId: req.tourist.digitalId,
        name: req.tourist.name,
        location: req.tourist.currentLocation,
        safetyScore: req.tourist.safetyScore,
        timestamp: new Date()
      });
    }

    const response = {
      message: 'Location updated successfully',
      safetyScore: req.tourist.safetyScore,
      timestamp: req.tourist.currentLocation.timestamp
    };

    if (geoAlert) {
      response.alert = geoAlert;
    }

    res.json(response);
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// SOS Emergency Alert
router.post('/sos', async (req, res) => {
  try {
    const { message, severity = 'critical' } = req.body;
    const { longitude, latitude } = req.tourist.currentLocation.coordinates;

    // Create SOS alert
    const alert = new Alert({
      touristId: req.tourist._id,
      digitalId: req.tourist.digitalId,
      type: 'SOS',
      severity,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        accuracy: req.tourist.currentLocation.accuracy
      },
      details: {
        message: message || 'Emergency SOS triggered',
        triggerCondition: 'Manual SOS button pressed',
        automaticTrigger: false
      }
    });

    // Find nearby zones for context
    const nearbyZones = await Zone.find({
      center: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 1000
        }
      }
    });

    if (nearbyZones.length > 0) {
      alert.location.zoneName = nearbyZones[0].name;
    }

    await alert.save();

    // Notify emergency contacts
    const notifications = [];
    for (const contact of req.tourist.emergencyContacts) {
      notifications.push({
        contactId: contact._id,
        name: contact.name,
        phone: contact.phone,
        notifiedAt: new Date(),
        method: 'sms',
        deliveryStatus: 'sent' // Mock delivery status
      });
    }
    alert.notifiedContacts = notifications;
    await alert.save();

    // Emit real-time alert to authorities
    if (req.io) {
      req.io.to('authorities').emit('emergency-alert', {
        alertId: alert._id,
        type: 'SOS',
        severity: alert.severity,
        tourist: {
          digitalId: req.tourist.digitalId,
          name: req.tourist.name,
          phone: req.tourist.phone
        },
        location: alert.location,
        message: alert.details.message,
        timestamp: alert.createdAt
      });
    }

    res.json({
      message: 'SOS alert sent successfully',
      alertId: alert._id,
      emergencyContacts: alert.notifiedContacts.length,
      location: alert.location
    });
  } catch (error) {
    console.error('SOS alert error:', error);
    res.status(500).json({ error: 'Failed to send SOS alert' });
  }
});

// Get safety score
router.get('/safety-score', async (req, res) => {
  try {
    const score = req.tourist.calculateSafetyScore();
    await req.tourist.save();

    res.json({
      safetyScore: score,
      factors: getSafetyFactors(req.tourist),
      lastCalculated: new Date()
    });
  } catch (error) {
    console.error('Safety score error:', error);
    res.status(500).json({ error: 'Failed to calculate safety score' });
  }
});

// Get nearby zones
router.get('/zones/nearby', async (req, res) => {
  try {
    const { longitude, latitude } = req.tourist.currentLocation.coordinates;
    
    const zones = await Zone.find({
      center: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 5000 // 5km radius
        }
      },
      isActive: true
    });

    const zonesWithDistance = zones.map(zone => {
      const distance = geolib.getDistance(
        { latitude, longitude },
        { 
          latitude: zone.center.coordinates[1], 
          longitude: zone.center.coordinates[0] 
        }
      );

      return {
        id: zone._id,
        name: zone.name,
        riskLevel: zone.getCurrentRiskLevel(),
        distance: distance,
        restrictions: zone.restrictions,
        description: zone.description
      };
    });

    res.json({ zones: zonesWithDistance });
  } catch (error) {
    console.error('Nearby zones error:', error);
    res.status(500).json({ error: 'Failed to get nearby zones' });
  }
});

// Get alert history
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({ touristId: req.tourist._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ alerts });
  } catch (error) {
    console.error('Alert history error:', error);
    res.status(500).json({ error: 'Failed to get alert history' });
  }
});

// Helper functions
async function checkGeofencing(tourist, longitude, latitude) {
  try {
    const zones = await Zone.find({ isActive: true });
    
    for (const zone of zones) {
      if (zone.containsPoint(longitude, latitude)) {
        const currentRisk = zone.getCurrentRiskLevel();
        
        // Create alert for high-risk or restricted zones
        if (currentRisk === 'high' || currentRisk === 'restricted') {
          const alert = new Alert({
            touristId: tourist._id,
            digitalId: tourist.digitalId,
            type: 'geofence',
            severity: currentRisk === 'restricted' ? 'critical' : 'high',
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
              zoneName: zone.name
            },
            details: {
              message: `Entered ${currentRisk} risk zone: ${zone.name}`,
              triggerCondition: `Zone entry: ${zone.name}`,
              automaticTrigger: true,
              additionalData: {
                zoneId: zone._id,
                restrictions: zone.restrictions
              }
            }
          });

          await alert.save();
          return alert;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Geofencing check error:', error);
    return null;
  }
}

async function calculateSafetyScore(tourist, longitude, latitude) {
  let score = 100;

  // Check time since last activity
  const now = new Date();
  const lastSeen = new Date(tourist.lastSeen);
  const hoursInactive = (now - lastSeen) / (1000 * 60 * 60);

  if (hoursInactive > 6) score -= 30;
  else if (hoursInactive > 3) score -= 15;
  else if (hoursInactive > 1) score -= 5;

  // Check current zone risk
  const zones = await Zone.find({ isActive: true });
  for (const zone of zones) {
    if (zone.containsPoint(longitude, latitude)) {
      const riskLevel = zone.getCurrentRiskLevel();
      switch (riskLevel) {
        case 'restricted': score -= 40; break;
        case 'high': score -= 25; break;
        case 'medium': score -= 10; break;
        default: break;
      }
      break;
    }
  }

  // Time of day factor
  const hour = now.getHours();
  if (hour >= 22 || hour <= 5) score -= 15; // Night time
  else if (hour >= 18 || hour <= 7) score -= 5; // Evening/early morning

  tourist.safetyScore = Math.max(0, Math.min(100, score));
}

function getSafetyFactors(tourist) {
  const factors = [];
  const score = tourist.safetyScore;

  if (score >= 80) factors.push('Good safety status');
  else if (score >= 60) factors.push('Moderate safety status');
  else factors.push('Low safety status - attention required');

  const now = new Date();
  const hoursInactive = (now - new Date(tourist.lastSeen)) / (1000 * 60 * 60);
  
  if (hoursInactive > 3) factors.push('Extended inactivity period');
  if (now.getHours() >= 22 || now.getHours() <= 5) factors.push('Night time travel');

  return factors;
}

module.exports = router;