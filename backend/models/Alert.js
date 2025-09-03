const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  
  digitalId: String, // Tourist's digital ID for quick reference
  
  // Alert types: SOS, geofence, anomaly, inactivity, manual
  type: {
    type: String,
    enum: ['SOS', 'geofence', 'anomaly', 'inactivity', 'manual'],
    required: true
  },
  
  // Severity levels
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  
  // Current status
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'in-progress', 'resolved', 'false-alarm'],
    default: 'active'
  },
  
  // Location where alert was triggered
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    zoneName: String,
    accuracy: Number
  },
  
  // Alert specific details
  details: {
    message: String,
    triggerCondition: String,
    duration: Number, // how long the condition existed before alert
    automaticTrigger: { type: Boolean, default: false },
    additionalData: mongoose.Schema.Types.Mixed
  },
  
  // Response tracking
  response: {
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Authority'
    },
    acknowledgedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Authority'
    },
    assignedAt: Date,
    responseTime: Number, // minutes from creation to acknowledgment
    resolutionTime: Number, // minutes from creation to resolution
    resolutionNotes: String,
    actionsTaken: [String]
  },
  
  // Communication log
  communications: [{
    from: String, // 'tourist', 'authority', 'system'
    message: String,
    timestamp: { type: Date, default: Date.now },
    messageType: {
      type: String,
      enum: ['text', 'location', 'status_update', 'system_alert']
    }
  }],
  
  // Emergency contacts notified
  notifiedContacts: [{
    contactId: String,
    name: String,
    phone: String,
    notifiedAt: Date,
    method: String, // 'sms', 'call', 'email'
    deliveryStatus: String // 'sent', 'delivered', 'failed'
  }],
  
  // Blockchain reference for immutable logging
  blockchainHash: String,
  
  // Auto-escalation settings
  escalation: {
    level: { type: Number, default: 1 },
    escalatedAt: [Date],
    maxLevel: { type: Number, default: 3 }
  }
  
}, {
  timestamps: true
});

// Indexes for performance
alertSchema.index({ touristId: 1, createdAt: -1 });
alertSchema.index({ status: 1, severity: 1, createdAt: -1 });
alertSchema.index({ location: '2dsphere' });
alertSchema.index({ digitalId: 1 });

// Auto-escalate alerts that remain unacknowledged
alertSchema.methods.checkEscalation = function() {
  if (this.status !== 'active') return false;
  
  const now = new Date();
  const createdMinutesAgo = (now - this.createdAt) / (1000 * 60);
  
  // Escalation thresholds based on severity
  const thresholds = {
    critical: 5,  // 5 minutes
    high: 15,     // 15 minutes
    medium: 30,   // 30 minutes
    low: 60       // 60 minutes
  };
  
  const threshold = thresholds[this.severity] || 30;
  
  if (createdMinutesAgo > threshold && this.escalation.level < this.escalation.maxLevel) {
    return true;
  }
  
  return false;
};

// Calculate response metrics
alertSchema.methods.calculateResponseTime = function() {
  if (!this.response.acknowledgedAt) return null;
  
  const responseTime = (this.response.acknowledgedAt - this.createdAt) / (1000 * 60);
  this.response.responseTime = Math.round(responseTime * 100) / 100;
  return this.response.responseTime;
};

alertSchema.methods.calculateResolutionTime = function() {
  if (this.status !== 'resolved' || !this.updatedAt) return null;
  
  const resolutionTime = (this.updatedAt - this.createdAt) / (1000 * 60);
  this.response.resolutionTime = Math.round(resolutionTime * 100) / 100;
  return this.response.resolutionTime;
};

// Add communication entry
alertSchema.methods.addCommunication = function(from, message, messageType = 'text') {
  this.communications.push({
    from,
    message,
    messageType,
    timestamp: new Date()
  });
};

// Priority score for sorting alerts
alertSchema.virtual('priorityScore').get(function() {
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  const baseScore = severityScores[this.severity] || 25;
  
  // Boost score based on time elapsed
  const minutesElapsed = (new Date() - this.createdAt) / (1000 * 60);
  const timeBoost = Math.min(minutesElapsed / 10, 25); // Max 25 point boost
  
  return baseScore + timeBoost;
});

alertSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Alert', alertSchema);