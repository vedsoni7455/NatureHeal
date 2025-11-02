import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors with pagination and filters
// @route   GET /api/doctor
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const specialization = req.query.specialization;
  const search = req.query.search;

  let query = { role: 'doctor' };

  // Add filters
  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }

  const count = await User.countDocuments(query);
  const doctors = await User.find(query)
    .select('-password')
    .populate('doctorDetails')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  // Get additional doctor details
  const doctorsWithDetails = await Promise.all(
    doctors.map(async (doctor) => {
      const doctorDetails = await Doctor.findOne({ user: doctor._id }).select('-user');
      const appointmentCount = await Appointment.countDocuments({
        doctor: doctor._id,
        status: 'completed'
      });

      return {
        ...doctor.toObject(),
        doctorDetails,
        totalAppointments: appointmentCount,
      };
    })
  );

  res.json({
    doctors: doctorsWithDetails,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get doctor by ID with full details
// @route   GET /api/doctor/:id
// @access  Public
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
    .select('-password')
    .populate('doctorDetails');

  if (doctor) {
    const doctorDetails = await Doctor.findOne({ user: doctor._id }).select('-user');
    const stats = await calculateDoctorStats(doctor._id);

    res.json({
      ...doctor.toObject(),
      doctorDetails,
      stats,
    });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Update doctor profile (doctor only)
// @route   PUT /api/doctor/profile
// @access  Private/Doctor
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.user._id);

  if (doctor && doctor.role === 'doctor') {
    // Update basic user fields
    doctor.name = req.body.name || doctor.name;
    doctor.email = req.body.email || doctor.email;
    doctor.phone = req.body.phone || doctor.phone;
    doctor.address = req.body.address || doctor.address;

    // Update doctor-specific fields
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience !== undefined ? req.body.experience : doctor.experience;
    doctor.licenseNumber = req.body.licenseNumber || doctor.licenseNumber;

    const updatedDoctor = await doctor.save();

    // Update or create doctor details
    let doctorDetails = await Doctor.findOne({ user: doctor._id });
    if (!doctorDetails) {
      doctorDetails = new Doctor({ user: doctor._id });
    }

    doctorDetails.consultationFee = req.body.consultationFee !== undefined ? req.body.consultationFee : doctorDetails.consultationFee;
    doctorDetails.bio = req.body.bio || doctorDetails.bio;
    doctorDetails.languages = req.body.languages || doctorDetails.languages;
    doctorDetails.certifications = req.body.certifications || doctorDetails.certifications;
    doctorDetails.availability = req.body.availability || doctorDetails.availability;

    await doctorDetails.save();

    res.json({
      _id: updatedDoctor._id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      role: updatedDoctor.role,
      specialization: updatedDoctor.specialization,
      experience: updatedDoctor.experience,
      licenseNumber: updatedDoctor.licenseNumber,
      phone: updatedDoctor.phone,
      address: updatedDoctor.address,
      doctorDetails,
    });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Get doctor's appointments (doctor only)
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;

  let query = { doctor: req.user._id };
  if (status) {
    query.status = status;
  }

  const count = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
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

// @desc    Get doctor statistics (doctor only)
// @route   GET /api/doctor/stats
// @access  Private/Doctor
export const getDoctorStats = asyncHandler(async (req, res) => {
  const stats = await calculateDoctorStats(req.user._id);
  res.json(stats);
});

// Helper function to calculate doctor statistics
const calculateDoctorStats = async (doctorId) => {
  const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
  const completedAppointments = await Appointment.countDocuments({
    doctor: doctorId,
    status: 'completed'
  });
  const pendingAppointments = await Appointment.countDocuments({
    doctor: doctorId,
    status: 'pending'
  });

  const avgRating = await Appointment.aggregate([
    { $match: { doctor: doctorId, status: 'completed', rating: { $exists: true } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  const monthlyStats = await Appointment.aggregate([
    {
      $match: {
        doctor: doctorId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return {
    totalAppointments,
    completedAppointments,
    pendingAppointments,
    completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0,
    averageRating: avgRating[0]?.avgRating?.toFixed(1) || 0,
    monthlyStats,
  };
};

// @desc    Get doctor's availability (doctor only)
// @route   GET /api/doctor/availability
// @access  Private/Doctor
export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctorDetails = await Doctor.findOne({ user: req.user._id }).select('availability');
  res.json(doctorDetails?.availability || []);
});

// @desc    Update doctor's availability (doctor only)
// @route   PUT /api/doctor/availability
// @access  Private/Doctor
export const updateDoctorAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  let doctorDetails = await Doctor.findOne({ user: req.user._id });
  if (!doctorDetails) {
    doctorDetails = new Doctor({ user: req.user._id });
  }

  doctorDetails.availability = availability;
  await doctorDetails.save();

  res.json({ message: 'Availability updated successfully', availability: doctorDetails.availability });
});
