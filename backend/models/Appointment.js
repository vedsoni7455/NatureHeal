import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Please add appointment date'],
  },
  time: {
    type: String, // e.g., "10:00 AM"
    required: [true, 'Please add appointment time'],
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['video', 'voice', 'message', 'in-person'],
    default: 'message',
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  notes: {
    type: String, // patient's notes
    maxlength: 1000,
  },
  symptoms: [String], // array of symptoms
  doctorResponse: {
    type: String, // doctor's response
    maxlength: 2000,
  },
  responseType: {
    type: String,
    enum: ['video', 'voice', 'message', 'prescription'],
  },
  responseDate: {
    type: Date,
  },
  prescription: {
    type: String, // prescription details
  },
  followUpDate: {
    type: Date,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    maxlength: 500,
  },
  meetingLink: {
    type: String, // for video calls
  },
  attachments: [{
    name: String,
    url: String,
    type: String, // 'image', 'document', etc.
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
