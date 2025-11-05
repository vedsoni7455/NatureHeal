import asyncHandler from 'express-async-handler';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get user prescriptions
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;

  let query = { patient: req.user._id };

  if (status) {
    query.status = status;
  }

  const count = await Prescription.countDocuments(query);
  const prescriptions = await Prescription.find(query)
    .populate('doctor', 'name specialization')
    .populate('appointment')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    prescriptions,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization licenseNumber')
    .populate('appointment');

  if (prescription) {
    // Check if user is authorized to view this prescription
    if (prescription.patient._id.toString() !== req.user._id.toString() &&
        prescription.doctor._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to view this prescription');
    }

    res.json(prescription);
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

// @desc    Create prescription (Doctor only)
// @route   POST /api/prescriptions
// @access  Private/Doctor
export const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, diagnosis, symptoms, medications, naturalRemedies, lifestyleRecommendations, followUpDate, notes } = req.body;

  // Verify doctor is authorized
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to create prescriptions');
  }

  // Verify patient exists
  const patient = await User.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  // If appointment ID provided, verify it exists and belongs to this doctor-patient pair
  let appointment = null;
  if (appointmentId) {
    appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctor.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Invalid appointment');
    }
  }

  const prescription = new Prescription({
    patient: patientId,
    doctor: req.user._id,
    appointment: appointmentId,
    diagnosis,
    symptoms,
    medications,
    naturalRemedies,
    lifestyleRecommendations,
    followUpDate,
    notes,
  });

  const createdPrescription = await prescription.save();

  // Update appointment status if provided
  if (appointment) {
    appointment.status = 'completed';
    await appointment.save();
  }

  res.status(201).json(createdPrescription);
});

// @desc    Update prescription (Doctor only)
// @route   PUT /api/prescriptions/:id
// @access  Private/Doctor
export const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (prescription) {
    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this prescription');
    }

    Object.assign(prescription, req.body);
    const updatedPrescription = await prescription.save();
    res.json(updatedPrescription);
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

// @desc    Delete prescription (Admin only)
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
export const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (prescription) {
    await prescription.remove();
    res.json({ message: 'Prescription removed' });
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

// @desc    Get doctor prescriptions
// @route   GET /api/prescriptions/doctor
// @access  Private/Doctor
export const getDoctorPrescriptions = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const patientId = req.query.patientId;

  let query = { doctor: req.user._id };

  if (patientId) {
    query.patient = patientId;
  }

  const count = await Prescription.countDocuments(query);
  const prescriptions = await Prescription.find(query)
    .populate('patient', 'name email phone')
    .populate('appointment')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    prescriptions,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get prescription statistics (Admin only)
// @route   GET /api/prescriptions/stats
// @access  Private/Admin
export const getPrescriptionStats = asyncHandler(async (req, res) => {
  const totalPrescriptions = await Prescription.countDocuments();
  const activePrescriptions = await Prescription.countDocuments({ status: 'active' });
  const completedPrescriptions = await Prescription.countDocuments({ status: 'completed' });

  const monthlyStats = await Prescription.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  res.json({
    totalPrescriptions,
    activePrescriptions,
    completedPrescriptions,
    monthlyStats,
  });
});
