// Doctor model is part of User model with role 'doctor'
// This file can be used for additional doctor-specific logic if needed
// For now, it's a placeholder

import mongoose from 'mongoose';

// Additional doctor-specific schema if needed beyond User model
const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: String, // e.g., "09:00"
    endTime: String, // e.g., "17:00"
  }],
  consultationFee: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  languages: [String],
  certifications: [String],
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
