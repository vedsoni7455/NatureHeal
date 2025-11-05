import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  // Patient-specific fields
  height: {
    type: Number, // in cm
  },
  weight: {
    type: Number, // in kg
  },
  age: {
    type: Number, // in years
  },
  disease: {
    type: String,
  },
  diseaseDuration: {
    type: String, // e.g., "2 months", "1 year"
  },
  // Wellness tracking fields
  wellnessGoals: [{
    type: String,
    enum: ['weight-loss', 'weight-gain', 'stress-reduction', 'better-sleep', 'increased-energy', 'immunity-boost', 'mental-health', 'fitness'],
  }],
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'mediterranean', 'ayurvedic'],
  }],
  allergies: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'managed'],
      default: 'active',
    },
    notes: String,
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedBy: String,
    startDate: Date,
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
  },
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  // Doctor-specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; },
  },
  experience: {
    type: Number, // years of experience
    required: function() { return this.role === 'doctor'; },
  },
  licenseNumber: {
    type: String,
  },
  // Common fields
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  profilePicture: {
    type: String, // URL to image
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return enteredPassword === this.password;
};



const User = mongoose.model('User', userSchema);

export default User;
