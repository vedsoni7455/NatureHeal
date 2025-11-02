import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import ChatbotQuery from '../models/ChatbotQuery.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getDashboardStats = asyncHandler(async (req, res) => {
  // User statistics
  const totalUsers = await User.countDocuments();
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const verifiedUsers = await User.countDocuments({ isVerified: true });

  // Appointment statistics
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
  const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
  const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
  const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

  // AI Chatbot statistics
  const totalQueries = await ChatbotQuery.countDocuments();
  const uniqueChatUsers = await ChatbotQuery.distinct('user').then(users => users.filter(u => u).length);

  // Revenue statistics (assuming consultationFee is in some currency)
  const totalRevenue = await Appointment.aggregate([
    { $match: { status: 'completed', paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$consultationFee' } } }
  ]);

  // Monthly trends (last 12 months)
  const monthlyStats = await getMonthlyStats();

  // Top specializations
  const topSpecializations = await User.aggregate([
    { $match: { role: 'doctor' } },
    { $group: { _id: '$specialization', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Average ratings
  const avgDoctorRating = await Appointment.aggregate([
    { $match: { status: 'completed', rating: { $exists: true } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  res.json({
    users: {
      total: totalUsers,
      patients: totalPatients,
      doctors: totalDoctors,
      admins: totalAdmins,
      verified: verifiedUsers,
      verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0,
    },
    appointments: {
      total: totalAppointments,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(2) : 0,
    },
    ai: {
      totalQueries,
      uniqueUsers: uniqueChatUsers,
    },
    revenue: {
      total: totalRevenue[0]?.total || 0,
    },
    trends: monthlyStats,
    topSpecializations,
    averageRating: avgDoctorRating[0]?.avgRating?.toFixed(1) || 0,
  });
});

// @desc    Get all users for admin with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const role = req.query.role;
  const search = req.query.search;
  const isVerified = req.query.isVerified;

  let query = {};

  if (role) query.role = role;
  if (isVerified !== undefined) query.isVerified = isVerified === 'true';
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

// @desc    Get all appointments for admin with pagination
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
export const getAllAppointments = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;
  const type = req.query.type;

  let query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const count = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name email specialization')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    appointments,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Update user verification status
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin only)
export const verifyUser = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.isVerified = isVerified;
    await user.save();

    res.json({ message: 'User verification status updated' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent deleting admin users
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    await user.remove();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get system logs/analytics
// @route   GET /api/admin/logs
// @access  Private (Admin only)
export const getSystemLogs = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;

  // User registration trends
  const userRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
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

  // Appointment trends
  const appointmentTrends = await Appointment.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
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

  // AI query trends
  const aiQueryTrends = await ChatbotQuery.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
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

  res.json({
    userRegistrations,
    appointmentTrends,
    aiQueryTrends,
  });
});

// Helper function to get monthly statistics
const getMonthlyStats = async () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 1);

    const users = await User.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    const appointments = await Appointment.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    const queries = await ChatbotQuery.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    months.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      users,
      appointments,
      queries,
    });
  }

  return months;
};
