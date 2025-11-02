import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import ChatbotQuery from '../models/ChatbotQuery.js';

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private
export const getUserDashboard = asyncHandler(async (req, res) => {
  const user = req.user;

  let dashboardData = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  };

  if (user.role === 'patient') {
    // Patient-specific data
    const totalAppointments = await Appointment.countDocuments({ patient: user._id });
    const upcomingAppointments = await Appointment.countDocuments({
      patient: user._id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    });
    const completedAppointments = await Appointment.countDocuments({
      patient: user._id,
      status: 'completed'
    });
    const totalQueries = await ChatbotQuery.countDocuments({ user: user._id });

    dashboardData.patient = {
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      totalQueries,
      healthProfile: {
        height: user.height,
        weight: user.weight,
        age: user.age,
        disease: user.disease,
        diseaseDuration: user.diseaseDuration,
      },
    };
  } else if (user.role === 'doctor') {
    // Doctor-specific data
    const totalAppointments = await Appointment.countDocuments({ doctor: user._id });
    const pendingAppointments = await Appointment.countDocuments({
      doctor: user._id,
      status: 'pending'
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: user._id,
      status: 'completed'
    });

    // Average rating
    const avgRating = await Appointment.aggregate([
      { $match: { doctor: user._id, status: 'completed', rating: { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    dashboardData.doctor = {
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      averageRating: avgRating[0]?.avgRating?.toFixed(1) || 0,
      specialization: user.specialization,
      experience: user.experience,
      licenseNumber: user.licenseNumber,
    };
  }

  res.json(dashboardData);
});

// @desc    Get user profile with additional details
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    // Get additional statistics
    const stats = await getUserStats(user._id, user.role);

    res.json({
      ...user.toObject(),
      stats,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Update role-specific fields
    if (user.role === 'patient') {
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.disease = req.body.disease || user.disease;
      user.diseaseDuration = req.body.diseaseDuration || user.diseaseDuration;
    } else if (user.role === 'doctor') {
      user.specialization = req.body.specialization || user.specialization;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
      user.licenseNumber = req.body.licenseNumber || user.licenseNumber;
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      message: 'Profile updated successfully',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload profile picture
// @route   POST /api/user/upload-profile-picture
// @access  Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  // This would typically handle file upload
  // For now, just update the profilePicture field
  const user = await User.findById(req.user._id);

  if (user) {
    user.profilePicture = req.body.imageUrl || user.profilePicture;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user notifications (placeholder)
// @route   GET /api/user/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
  // This would typically fetch from a notifications collection
  // For now, return mock data
  const notifications = [
    {
      _id: '1',
      type: 'appointment_reminder',
      title: 'Upcoming Appointment',
      message: 'You have an appointment scheduled for tomorrow',
      read: false,
      createdAt: new Date(),
    },
    {
      _id: '2',
      type: 'system',
      title: 'Welcome to NatureHeal',
      message: 'Thank you for joining our platform',
      read: true,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
  ];

  res.json({ notifications });
});

// @desc    Mark notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  // This would typically update a notification document
  res.json({ message: 'Notification marked as read' });
});

// @desc    Get all users (admin only)
// @route   GET /api/user
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const role = req.query.role;
  const search = req.query.search;

  let query = {};

  // Add filters
  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const count = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get user by ID (admin only)
// @route   GET /api/user/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (admin only)
// @route   PUT /api/user/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;

    // Update role-specific fields
    if (user.role === 'patient') {
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.disease = req.body.disease || user.disease;
      user.diseaseDuration = req.body.diseaseDuration || user.diseaseDuration;
    } else if (user.role === 'doctor') {
      user.specialization = req.body.specialization || user.specialization;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
      user.licenseNumber = req.body.licenseNumber || user.licenseNumber;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/user/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Delete related appointments
    await Appointment.deleteMany({ $or: [{ patient: user._id }, { doctor: user._id }] });

    // Delete related chatbot queries
    await ChatbotQuery.deleteMany({ user: user._id });

    // Delete doctor details if exists
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ user: user._id });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Helper function to get user statistics
const getUserStats = async (userId, role) => {
  if (role === 'patient') {
    const totalAppointments = await Appointment.countDocuments({ patient: userId });
    const completedAppointments = await Appointment.countDocuments({
      patient: userId,
      status: 'completed'
    });
    const totalQueries = await ChatbotQuery.countDocuments({ user: userId });

    return {
      totalAppointments,
      completedAppointments,
      totalQueries,
      appointmentCompletionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(2) : 0,
    };
  } else if (role === 'doctor') {
    const totalAppointments = await Appointment.countDocuments({ doctor: userId });
    const completedAppointments = await Appointment.countDocuments({
      doctor: userId,
      status: 'completed'
    });

    const avgRating = await Appointment.aggregate([
      { $match: { doctor: userId, status: 'completed', rating: { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    return {
      totalAppointments,
      completedAppointments,
      averageRating: avgRating[0]?.avgRating?.toFixed(1) || 0,
      totalReviews: avgRating[0]?.totalReviews || 0,
      completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(2) : 0,
    };
  }

  return {};
};
