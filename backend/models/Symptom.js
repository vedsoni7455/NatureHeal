import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a symptom name'],
    unique: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ['physical', 'mental', 'digestive', 'respiratory', 'skin', 'musculoskeletal', 'general'],
    default: 'general',
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild',
  },
  commonCauses: [String],
  naturalRemedies: [{
    remedy: {
      type: String,
      required: true,
    },
    description: String,
    preparation: String,
    dosage: String,
    duration: String,
  }],
  homeopathicRemedies: [{
    remedy: {
      type: String,
      required: true,
    },
    potency: String,
    frequency: String,
    notes: String,
  }],
  lifestyleRecommendations: [String],
  whenToSeeDoctor: [String],
  relatedSymptoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
symptomSchema.index({ name: 1 });
symptomSchema.index({ category: 1 });
symptomSchema.index({ isActive: 1 });

const Symptom = mongoose.model('Symptom', symptomSchema);

export default Symptom;
