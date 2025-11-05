import asyncHandler from 'express-async-handler';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';

// @desc    Get user reminders
// @route   GET /api/reminders
// @access  Private
export const getReminders = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;
  const type = req.query.type;

  let query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  const count = await Reminder.countDocuments(query);
  const reminders = await Reminder.find(query)
    .populate('relatedAppointment')
    .populate('relatedPrescription')
    .sort({ scheduledDate: 1, scheduledTime: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    reminders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
export const getReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id)
    .populate('relatedAppointment')
    .populate('relatedPrescription');

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to view this reminder');
    }

    res.json(reminder);
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    description,
    scheduledDate,
    scheduledTime,
    frequency,
    customFrequency,
    priority,
    notificationMethods,
    relatedAppointment,
    relatedPrescription,
    metadata,
  } = req.body;

  const reminder = new Reminder({
    user: req.user._id,
    type,
    title,
    description,
    scheduledDate,
    scheduledTime,
    frequency,
    customFrequency,
    priority,
    notificationMethods,
    relatedAppointment,
    relatedPrescription,
    metadata,
  });

  const createdReminder = await reminder.save();
  res.status(201).json(createdReminder);
});

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this reminder');
    }

    Object.assign(reminder, req.body);
    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this reminder');
    }

    await reminder.remove();
    res.json({ message: 'Reminder removed' });
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Acknowledge reminder
// @route   PUT /api/reminders/:id/acknowledge
// @access  Private
export const acknowledgeReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to acknowledge this reminder');
    }

    reminder.status = 'acknowledged';
    reminder.acknowledgedAt = new Date();
    await reminder.save();

    res.json({ message: 'Reminder acknowledged' });
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Complete reminder
// @route   PUT /api/reminders/:id/complete
// @access  Private
export const completeReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to complete this reminder');
    }

    reminder.status = 'completed';
    reminder.completedAt = new Date();
    await reminder.save();

    res.json({ message: 'Reminder completed' });
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Snooze reminder
// @route   PUT /api/reminders/:id/snooze
// @access  Private
export const snoozeReminder = asyncHandler(async (req, res) => {
  const { minutes } = req.body;
  const reminder = await Reminder.findById(req.params.id);

  if (reminder) {
    // Check authorization
    if (reminder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to snooze this reminder');
    }

    if (reminder.snoozeCount >= 3) {
      res.status(400);
      throw new Error('Maximum snooze limit reached');
    }

    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + (minutes || 15));

    reminder.snoozeUntil = snoozeUntil;
    reminder.snoozeCount += 1;
    await reminder.save();

    res.json({ message: 'Reminder snoozed', snoozeUntil });
  } else {
    res.status(404);
    throw new Error('Reminder not found');
  }
});

// @desc    Get upcoming reminders
// @route   GET /api/reminders/upcoming
// @access  Private
export const getUpcomingReminders = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const now = new Date();

  const reminders = await Reminder.find({
    user: req.user._id,
    status: { $in: ['pending', 'sent'] },
    scheduledDate: { $gte: now },
    $or: [
      { snoozeUntil: { $exists: false } },
      { snoozeUntil: { $lte: now } },
    ],
  })
    .populate('relatedAppointment')
    .populate('relatedPrescription')
    .sort({ scheduledDate: 1, scheduledTime: 1 })
    .limit(limit);

  res.json(reminders);
});

// @desc    Get reminder statistics
// @route   GET /api/reminders/stats
// @access  Private
export const getReminderStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Reminder.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await Reminder.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Reminder.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    statusStats: stats,
    typeStats,
    priorityStats,
  });
});

// @desc    Create appointment reminder (Internal use)
// @route   POST /api/reminders/appointment
// @access  Private
export const createAppointmentReminder = asyncHandler(async (req, res) => {
  const { appointmentId, userId, appointmentDate, doctorName } = req.body;

  // Check if reminder already exists
  const existingReminder = await Reminder.findOne({
    user: userId,
    relatedAppointment: appointmentId,
    type: 'appointment',
  });

  if (existingReminder) {
    return res.json(existingReminder);
  }

  const reminderDate = new Date(appointmentDate);
  reminderDate.setHours(reminderDate.getHours() - 24); // 24 hours before

  const reminder = new Reminder({
    user: userId,
    type: 'appointment',
    title: `Appointment with Dr. ${doctorName}`,
    description: 'You have an upcoming appointment. Please confirm your attendance.',
    scheduledDate: reminderDate,
    priority: 'high',
    notificationMethods: ['email', 'in-app'],
    relatedAppointment: appointmentId,
  });

  const createdReminder = await reminder.save();
  res.status(201).json(createdReminder);
});

// @desc    Create medication reminder (Internal use)
// @route   POST /api/reminders/medication
// @access  Private
export const createMedicationReminder = asyncHandler(async (req, res) => {
  const { prescriptionId, userId, medicationName, dosage, frequency, startDate } = req.body;

  const reminder = new Reminder({
    user: userId,
    type: 'medication',
    title: `Take ${medicationName}`,
    description: `Dosage: ${dosage}, Frequency: ${frequency}`,
    scheduledDate: new Date(startDate),
    frequency: 'daily',
    priority: 'high',
    notificationMethods: ['in-app'],
    relatedPrescription: prescriptionId,
    metadata: {
      medicationName,
      dosage,
    },
  });

  const createdReminder = await reminder.save();
  res.status(201).json(createdReminder);
});
