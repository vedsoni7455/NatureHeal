import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Get all appointments (admin/doctor/patient)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;
  const type = req.query.type;

  let query = {};

  // Filter based on user role
  if (req.user.role === 'admin') {
    // Admin can see all appointments
  } else if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  } else {
    query.patient = req.user._id;
  }

  // Additional filters
  if (status) query.status = status;
  if (type) query.type = type;

  const count = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name email specialization phone')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ date: -1, time: -1 });

  res.json({
    appointments,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email phone address')
    .populate('doctor', 'name email specialization phone address');

  if (appointment) {
    // Check if user is authorized
    if (req.user.role !== 'admin' &&
        appointment.patient._id.toString() !== req.user._id.toString() &&
        appointment.doctor._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this appointment');
    }
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    doctor,
    date,
    time,
    duration,
    type,
    consultationFee,
    notes,
    symptoms
  } = req.body;

  // Validate required fields
  if (!doctor || !date || !time || !type) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if doctor exists and is a doctor
  const doctorUser = await User.findById(doctor);
  if (!doctorUser || doctorUser.role !== 'doctor') {
    res.status(400);
    throw new Error('Invalid doctor selected');
  }

  // Check for conflicting appointments
  const conflictingAppointment = await Appointment.findOne({
    doctor,
    date,
    time,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (conflictingAppointment) {
    res.status(400);
    throw new Error('Doctor is not available at this time');
  }

  const appointment = new Appointment({
    patient: req.user._id,
    doctor,
    date,
    time,
    duration: duration || 30,
    type,
    consultationFee: consultationFee || 0,
    notes,
    symptoms,
  });

  const createdAppointment = await appointment.save();
  await createdAppointment.populate('patient', 'name email');
  await createdAppointment.populate('doctor', 'name email specialization');

  res.status(201).json(createdAppointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if user is authorized
    if (req.user.role !== 'admin' &&
        appointment.patient.toString() !== req.user._id.toString() &&
        appointment.doctor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this appointment');
    }

    // Update fields based on user role
    if (req.user.role === 'patient' && appointment.status === 'pending') {
      // Patients can update notes and symptoms
      appointment.notes = req.body.notes || appointment.notes;
      appointment.symptoms = req.body.symptoms || appointment.symptoms;
    } else if (req.user.role === 'doctor' || req.user.role === 'admin') {
      // Doctors and admins can update more fields
      appointment.status = req.body.status || appointment.status;
      appointment.doctorResponse = req.body.doctorResponse || appointment.doctorResponse;
      appointment.responseType = req.body.responseType || appointment.responseType;
      appointment.responseDate = req.body.responseDate || new Date();
      appointment.prescription = req.body.prescription || appointment.prescription;
      appointment.followUpDate = req.body.followUpDate || appointment.followUpDate;
      appointment.meetingLink = req.body.meetingLink || appointment.meetingLink;
      appointment.paymentStatus = req.body.paymentStatus || appointment.paymentStatus;
    }

    const updatedAppointment = await appointment.save();
    await updatedAppointment.populate('patient', 'name email');
    await updatedAppointment.populate('doctor', 'name email specialization');

    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if user is authorized (only patients can delete their own appointments, or admins)
    if (req.user.role !== 'admin' && appointment.patient.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this appointment');
    }

    // Only allow deletion of pending appointments
    if (appointment.status !== 'pending') {
      res.status(400);
      throw new Error('Cannot delete confirmed or completed appointments');
    }

    await appointment.remove();
    res.json({ message: 'Appointment cancelled successfully' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get appointment statistics (Admin/Doctor)
// @route   GET /api/appointments/stats
// @access  Private
export const getAppointmentStats = asyncHandler(async (req, res) => {
  let matchQuery = {};

  if (req.user.role === 'doctor') {
    matchQuery.doctor = req.user._id;
  }

  const stats = await Appointment.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalAppointments = await Appointment.countDocuments(matchQuery);
  const completedAppointments = await Appointment.countDocuments({
    ...matchQuery,
    status: 'completed'
  });

  res.json({
    stats,
    total: totalAppointments,
    completed: completedAppointments,
    completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0
  });
});

// @desc    Rate appointment (Patient only)
// @route   PUT /api/appointments/:id/rate
// @access  Private
export const rateAppointment = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if user is the patient and appointment is completed
    if (appointment.patient.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (appointment.status !== 'completed') {
      res.status(400);
      throw new Error('Can only rate completed appointments');
    }

    appointment.rating = rating;
    appointment.review = review;

    await appointment.save();
    res.json({ message: 'Appointment rated successfully' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});
