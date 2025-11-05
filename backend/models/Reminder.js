import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  type: {
    type: String,
    enum: ['appointment', 'medication', 'exercise', 'meal', 'meditation', 'checkup', 'prescription', 'custom'],
    required: [true, 'Please add reminder type'],
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please add a scheduled date'],
  },
  scheduledTime: {
    type: String, // e.g., "10:00 AM"
  },
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly', 'custom'],
    default: 'once',
  },
  customFrequency: {
    interval: Number, // days between reminders
    endDate: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'acknowledged', 'completed', 'cancelled'],
    default: 'pending',
  },
  notificationMethods: [{
    type: String,
    enum: ['email', 'sms', 'whatsapp', 'push', 'in-app'],
    default: ['in-app'],
  }],
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  relatedPrescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  metadata: {
    medicationName: String,
    dosage: String,
    exerciseType: String,
    mealType: String,
    meditationType: String,
  },
  sentAt: Date,
  acknowledgedAt: Date,
  completedAt: Date,
  snoozeUntil: Date,
  snoozeCount: {
    type: Number,
    default: 0,
    max: 3,
  },
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
reminderSchema.index({ user: 1, scheduledDate: 1 });
reminderSchema.index({ status: 1, scheduledDate: 1 });
reminderSchema.index({ type: 1 });
reminderSchema.index({ isActive: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
