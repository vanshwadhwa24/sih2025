const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const touristSchema = new mongoose.Schema({
  digitalId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'TID_' + crypto.randomBytes(8).toString('hex').toUpperCase();
    }
  },
  
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  
  // ID Proof (hashed for privacy)
  idProofHash: { type: String, required: true },
  nationality: { type: String, required: true },
  
  // Trip Details
  tripDetails: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    plannedRoute: [String],
    accommodations: [String]
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  
  // Current Status
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    timestamp: { type: Date, default: Date.now },
    accuracy: Number
  },
  
  safetyScore: { type: Number, default: 85, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  
  // Activity tracking
  locationHistory: [{
    coordinates: [Number],
    timestamp: Date,
    zone: String
  }],
  
  // Blockchain hash for immutable record
  blockchainHash: String
  
}, {
  timestamps: true
});

// Create geospatial index
touristSchema.index({ "currentLocation": "2dsphere" });

// Hash password before saving
touristSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
touristSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate safety score based on current status
touristSchema.methods.calculateSafetyScore = function() {
  let score = 100;
  
  const now = new Date();
  const lastSeen = new Date(this.lastSeen);
  const hoursInactive = (now - lastSeen) / (1000 * 60 * 60);
  
  // Deduct points for inactivity
  if (hoursInactive > 6) score -= 20;
  else if (hoursInactive > 3) score -= 10;
  
  // Deduct for high-risk zones (will be calculated in service)
  // This is placeholder logic
  
  this.safetyScore = Math.max(0, score);
  return this.safetyScore;
};

// Check if trip is valid/active
touristSchema.methods.isTripActive = function() {
  const now = new Date();
  return now >= this.tripDetails.startDate && now <= this.tripDetails.endDate;
};

// Virtual for trip status
touristSchema.virtual('tripStatus').get(function() {
  const now = new Date();
  if (now < this.tripDetails.startDate) return 'upcoming';
  if (now > this.tripDetails.endDate) return 'completed';
  return 'active';
});

// Ensure virtuals are included in JSON
touristSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tourist', touristSchema);