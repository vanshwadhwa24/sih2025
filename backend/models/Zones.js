const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Risk levels: safe, medium, high, restricted
  riskLevel: {
    type: String,
    enum: ['safe', 'medium', 'high', 'restricted'],
    required: true
  },
  
  // GeoJSON Polygon for zone boundaries
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of Linear Ring coordinates
      required: true
    }
  },
  
  // Center point for quick distance calculations
  center: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  
  description: String,
  
  // Time-based restrictions
  restrictions: {
    timeRestrictions: {
      startTime: String, // "20:00" format
      endTime: String,   // "06:00" format
      description: String
    },
    requiresPermit: { type: Boolean, default: false },
    maxGroupSize: Number,
    specialInstructions: [String]
  },
  
  // Contact info for local authorities
  localAuthority: {
    station: String,
    phone: String,
    responsibleOfficer: String
  },
  
  // Statistics
  stats: {
    totalIncidents: { type: Number, default: 0 },
    lastIncidentDate: Date,
    avgResponseTime: Number // in minutes
  },
  
  isActive: { type: Boolean, default: true }
  
}, {
  timestamps: true
});

// Create geospatial index for the geometry
zoneSchema.index({ geometry: '2dsphere' });
zoneSchema.index({ center: '2dsphere' });

// Method to check if a point is inside this zone
zoneSchema.methods.containsPoint = function(longitude, latitude) {
  // This is a simplified check - in production, use proper GeoJSON intersection
  const point = { type: 'Point', coordinates: [longitude, latitude] };
  
  // MongoDB $geoIntersects query would be used here
  // For hackathon, we'll use a simple distance check from center
  const geolib = require('geolib');
  
  if (!this.center.coordinates.length) return false;
  
  const distance = geolib.getDistance(
    { latitude, longitude },
    { latitude: this.center.coordinates[1], longitude: this.center.coordinates[0] }
  );
  
  // Assume zone radius based on risk level (simplified)
  const radius = this.riskLevel === 'restricted' ? 500 : 
                this.riskLevel === 'high' ? 1000 : 
                this.riskLevel === 'medium' ? 2000 : 5000;
  
  return distance <= radius;
};

// Check if zone has time restrictions at given time
zoneSchema.methods.isRestrictedAtTime = function(dateTime = new Date()) {
  if (!this.restrictions.timeRestrictions.startTime) return false;
  
  const currentHour = dateTime.getHours();
  const currentMin = dateTime.getMinutes();
  const currentTime = currentHour * 60 + currentMin;
  
  const [startH, startM] = this.restrictions.timeRestrictions.startTime.split(':').map(Number);
  const [endH, endM] = this.restrictions.timeRestrictions.endTime.split(':').map(Number);
  
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;
  
  // Handle overnight restrictions (e.g., 20:00 to 06:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }
  
  return currentTime >= startTime && currentTime <= endTime;
};

// Get risk level with time consideration
zoneSchema.methods.getCurrentRiskLevel = function(dateTime = new Date()) {
  let riskLevel = this.riskLevel;
  
  // Increase risk level during restricted hours
  if (this.isRestrictedAtTime(dateTime)) {
    const riskLevels = ['safe', 'medium', 'high', 'restricted'];
    const currentIndex = riskLevels.indexOf(riskLevel);
    const newIndex = Math.min(currentIndex + 1, riskLevels.length - 1);
    riskLevel = riskLevels[newIndex];
  }
  
  return riskLevel;
};

module.exports = mongoose.model('Zone', zoneSchema);