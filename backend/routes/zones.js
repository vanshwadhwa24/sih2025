const express = require('express');
const Zone = require('../models/Zone');
const { authenticateAuthority, requirePermission, authenticateAny } = require('../middleware/auth');

const router = express.Router();

// Get all zones (public endpoint for tourist app)
router.get('/all', authenticateAny, async (req, res) => {
  try {
    const zones = await Zone.find({ isActive: true })
      .select('name riskLevel center description restrictions stats')
      .sort({ riskLevel: 1, name: 1 });

    const zonesWithCurrentRisk = zones.map(zone => ({
      id: zone._id,
      name: zone.name,
      riskLevel: zone.riskLevel,
      currentRiskLevel: zone.getCurrentRiskLevel(),
      center: zone.center,
      description: zone.description,
      restrictions: zone.restrictions,
      stats: zone.stats,
      isTimeRestricted: zone.isRestrictedAtTime()
    }));

    res.json({ zones: zonesWithCurrentRisk });
  } catch (error) {
    console.error('Get all zones error:', error);
    res.status(500).json({ error: 'Failed to get zones' });
  }
});

// Get zones near a location
router.get('/nearby', authenticateAny, async (req, res) => {
  try {
    const { longitude, latitude, radius = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const zones = await Zone.find({
      center: {
        $near: {
          $geometry: { 
            type: 'Point', 
            coordinates: [parseFloat(longitude), parseFloat(latitude)] 
          },
          $maxDistance: parseInt(radius)
        }
      },
      isActive: true
    });

    const geolib = require('geolib');
    const zonesWithDistance = zones.map(zone => {
      const distance = geolib.getDistance(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        { 
          latitude: zone.center.coordinates[1], 
          longitude: zone.center.coordinates[0] 
        }
      );

      return {
        id: zone._id,
        name: zone.name,
        riskLevel: zone.riskLevel,
        currentRiskLevel: zone.getCurrentRiskLevel(),
        distance: distance,
        center: zone.center,
        description: zone.description,
        restrictions: zone.restrictions,
        isTimeRestricted: zone.isRestrictedAtTime()
      };
    });

    // Sort by distance
    zonesWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({ zones: zonesWithDistance });
  } catch (error) {
    console.error('Get nearby zones error:', error);
    res.status(500).json({ error: 'Failed to get nearby zones' });
  }
});

// Check if location is in restricted zone
router.post('/check', authenticateAny, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const zones = await Zone.find({ isActive: true });
    const currentZones = [];
    let highestRiskLevel = 'safe';

    for (const zone of zones) {
      if (zone.containsPoint(longitude, latitude)) {
        const currentRisk = zone.getCurrentRiskLevel();
        currentZones.push({
          id: zone._id,
          name: zone.name,
          riskLevel: zone.riskLevel,
          currentRiskLevel: currentRisk,
          restrictions: zone.restrictions,
          isTimeRestricted: zone.isRestrictedAtTime()
        });

        // Update highest risk level
        const riskLevels = ['safe', 'medium', 'high', 'restricted'];
        if (riskLevels.indexOf(currentRisk) > riskLevels.indexOf(highestRiskLevel)) {
          highestRiskLevel = currentRisk;
        }
      }
    }

    const response = {
      inZones: currentZones,
      highestRiskLevel,
      isRestricted: highestRiskLevel === 'restricted',
      isHighRisk: ['high', 'restricted'].includes(highestRiskLevel),
      recommendations: getLocationRecommendations(highestRiskLevel, currentZones)
    };

    res.json(response);
  } catch (error) {
    console.error('Zone check error:', error);
    res.status(500).json({ error: 'Failed to check location' });
  }
});

// Create new zone (authority only)
router.post('/', authenticateAuthority, requirePermission('create_zones'), async (req, res) => {
  try {
    const {
      name, riskLevel, coordinates, center, description,
      restrictions, localAuthority
    } = req.body;

    // Validate required fields
    if (!name || !riskLevel || !coordinates) {
      return res.status(400).json({ error: 'Name, risk level, and coordinates are required' });
    }

    const zone = new Zone({
      name,
      riskLevel,
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      },
      center: center || {
        type: 'Point',
        coordinates: calculateCentroid(coordinates[0])
      },
      description,
      restrictions: restrictions || {},
      localAuthority: localAuthority || {}
    });

    await zone.save();

    res.status(201).json({
      message: 'Zone created successfully',
      zone: {
        id: zone._id,
        name: zone.name,
        riskLevel: zone.riskLevel,
        center: zone.center,
        description: zone.description
      }
    });
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({ error: 'Failed to create zone' });
  }
});

// Update zone (authority only)
router.put('/:id', authenticateAuthority, requirePermission('create_zones'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const zone = await Zone.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json({
      message: 'Zone updated successfully',
      zone
    });
  } catch (