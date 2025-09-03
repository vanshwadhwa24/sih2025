const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authoritySchema = new mongoose.Schema({
  badgeNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Authority details
  department: {
    type: String,
    enum: ['police', 'tourism', 'emergency', 'admin'],
    required: true
  },
  
  rank: String,
  station: String,
  jurisdiction: {
    areas: [String], // Area names they're responsible for
    zones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }]
  },
  
  // Contact information
  phone: { type: String, required: true },
  emergencyPhone: String,
  
  // Current status
  isOnDuty: { type: Boolean, default: false },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Performance metrics
  stats: {
    alertsHandled: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 }, // in minutes
    activeAlerts: { type: Number, default: 0 },
    successfulResolutions: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 }
  },
  
  // Permissions
  permissions: [{
    type: String,
    enum: [
      'view_alerts',
      'acknowledge_alerts',
      'resolve_alerts',
      'view_tourists',
      'create_zones',
      'manage_authorities',
      'access_dashboard',
      'export_data'
    ]
  }],
  
  // Notification preferences
  notifications: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: true },
    alertTypes: [{
      type: String,
      enum: ['SOS', 'geofence', 'anomaly', 'inactivity']
    }]
  },
  
  lastLogin: Date,
  isActive: { type: Boolean, default: true }
  
}, {
  timestamps: true
});

// Create indexes
authoritySchema.index({ badgeNumber: 1 });
authoritySchema.index({ department: 1, isOnDuty: 1 });
authoritySchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
authoritySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
authoritySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update stats after resolving alert
authoritySchema.methods.updateStatsAfterAlert = function(responseTimeMinutes, wasSuccessful = true) {
  this.stats.alertsHandled += 1;
  this.stats.activeAlerts = Math.max(0, this.stats.activeAlerts - 1);
  
  if (wasSuccessful) {
    this.stats.successfulResolutions += 1;
  }
  
  // Update average response time
  const totalPreviousTime = this.stats.avgResponseTime * (this.stats.alertsHandled - 1);
  this.stats.avgResponseTime = (totalPreviousTime + responseTimeMinutes) / this.stats.alertsHandled;
  
  // Update rating based on performance (simplified algorithm)
  const successRate = this.stats.successfulResolutions / this.stats.alertsHandled;
  const responseBonus = responseTimeMinutes < 15 ? 0.5 : responseTimeMinutes < 30 ? 0.2 : 0;
  
  this.stats.rating = Math.min(5, (successRate * 4) + 1 + responseBonus);
};

// Check if authority has permission
authoritySchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.department === 'admin';
};

// Get authorities on duty near a location
authoritySchema.statics.findNearbyOnDuty = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    isOnDuty: true,
    isActive: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  }).sort({ 'stats.rating': -1 });
};

// Default permissions based on department
authoritySchema.pre('save', function(next) {
  if (this.isNew && (!this.permissions || this.permissions.length === 0)) {
    switch (this.department) {
      case 'police':
        this.permissions = ['view_alerts', 'acknowledge_alerts', 'resolve_alerts', 'view_tourists', 'access_dashboard'];
        break;
      case 'tourism':
        this.permissions = ['view_alerts', 'view_tourists', 'create_zones', 'access_dashboard', 'export_data'];
        break;
      case 'emergency':
        this.permissions = ['view_alerts', 'acknowledge_alerts', 'resolve_alerts', 'access_dashboard'];
        break;
      case 'admin':
        this.permissions = ['view_alerts', 'acknowledge_alerts', 'resolve_alerts', 'view_tourists', 'create_zones', 'manage_authorities', 'access_dashboard', 'export_data'];
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Authority', authoritySchema);