import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import DietPlan from '../models/DietPlan.js';
import Symptom from '../models/Symptom.js';

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
    .select('-password');

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

// @desc    Get doctor's patients (doctor only)
// @route   GET /api/doctor/patients
// @access  Private/Doctor
export const getDoctorPatients = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const type = req.query.type; // 'booked' or 'diagnosed'

  // Get unique patients based on appointment status
  let matchQuery = { doctor: req.user._id };

  if (type === 'booked') {
    matchQuery.status = { $in: ['pending', 'confirmed'] };
  } else if (type === 'diagnosed') {
    matchQuery.status = 'completed';
  }

  const appointments = await Appointment.find(matchQuery)
    .populate('patient', 'name email phone age gender')
    .select('patient symptoms doctorResponse status')
    .sort({ createdAt: -1 });

  // Get unique patients
  const patientMap = new Map();
  for (const appointment of appointments) {
    const patientId = appointment.patient._id.toString();
    if (!patientMap.has(patientId)) {
      patientMap.set(patientId, {
        patient: appointment.patient,
        appointment: appointment,
        symptoms: appointment.symptoms || [],
        status: appointment.status
      });
    }
  }

  const patients = Array.from(patientMap.values());

  // Get additional data for each patient
  const patientsWithDetails = await Promise.all(
    patients.map(async (patientData) => {
      const { patient, appointment, symptoms, status } = patientData;

      // Get diet plans
      const dietPlans = await DietPlan.find({ user: patient._id, isActive: true })
        .select('title goals weeklyRoutine')
        .sort({ createdAt: -1 })
        .limit(1);

      // Get symptom details
      const symptomDetails = await Symptom.find({ name: { $in: symptoms } })
        .select('name category severity');

      return {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
        appointmentStatus: status,
        symptoms: symptomDetails,
        dietPlans: dietPlans.length > 0 ? dietPlans[0] : null,
        lastAppointment: appointment.createdAt
      };
    })
  );

  // Paginate results
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPatients = patientsWithDetails.slice(startIndex, endIndex);

  res.json({
    patients: paginatedPatients,
    page,
    pages: Math.ceil(patientsWithDetails.length / pageSize),
    total: patientsWithDetails.length,
  });
});

// @desc    Get patient details with full information (doctor only)
// @route   GET /api/doctor/patients/:patientId
// @access  Private/Doctor
export const getPatientDetails = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  // Verify doctor has access to this patient
  const hasAccess = await Appointment.findOne({
    doctor: req.user._id,
    patient: patientId
  });

  if (!hasAccess) {
    res.status(403);
    throw new Error('Not authorized to view this patient');
  }

  // Get patient basic info
  const patient = await User.findById(patientId).select('-password');
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  // Get appointments with this doctor
  const appointments = await Appointment.find({
    doctor: req.user._id,
    patient: patientId
  })
    .select('date time status symptoms doctorResponse prescription followUpDate')
    .sort({ date: -1 });

  // Get active diet plans
  const dietPlans = await DietPlan.find({
    user: patientId,
    isActive: true
  })
    .select('title description goals dailyMeals weeklyRoutine supplements progress')
    .sort({ createdAt: -1 });

  // Get symptoms from appointments
  const allSymptoms = [];
  appointments.forEach(apt => {
    if (apt.symptoms) {
      allSymptoms.push(...apt.symptoms);
    }
  });
  const uniqueSymptoms = [...new Set(allSymptoms)];

  const symptomDetails = await Symptom.find({ name: { $in: uniqueSymptoms } })
    .select('name description category severity naturalRemedies');

  res.json({
    patient: {
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      address: patient.address
    },
    appointments,
    dietPlans,
    symptoms: symptomDetails
  });
});
