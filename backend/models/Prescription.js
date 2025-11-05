import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a patient'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a doctor'],
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  diagnosis: {
    type: String,
    required: [true, 'Please add a diagnosis'],
    maxlength: 1000,
  },
  symptoms: [String],
  medications: [{
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instructions: String,
    isNatural: {
      type: Boolean,
      default: true,
    },
  }],
  naturalRemedies: [{
    remedy: {
      type: String,
      required: true,
    },
    preparation: String,
    dosage: String,
    frequency: String,
    duration: String,
    benefits: String,
  }],
  lifestyleRecommendations: [{
    category: {
      type: String,
      enum: ['diet', 'exercise', 'sleep', 'stress', 'environment'],
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  }],
  followUpDate: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  isDigital: {
    type: Boolean,
    default: true,
  },
  prescriptionNumber: {
    type: String,
    unique: true,
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
}, {
  timestamps: true,
});

// Generate prescription number before saving
prescriptionSchema.pre('save', function(next) {
  if (!this.prescriptionNumber) {
    this.prescriptionNumber = `RX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Index for efficient queries
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ prescriptionNumber: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
