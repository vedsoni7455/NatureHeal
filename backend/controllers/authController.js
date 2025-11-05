import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    height,
    weight,
    age,
    disease,
    diseaseDuration,
    specialization,
    experience,
    phone
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validate required fields based on role
  if (role === 'doctor') {
    if (!specialization || !experience) {
      res.status(400);
      throw new Error('All doctor fields are required');
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'patient',
    height,
    weight,
    age,
    disease,
    diseaseDuration,
    specialization,
    experience,
    phone,
  });

  if (user) {
    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      height: user.height,
      weight: user.weight,
      age: user.age,
      disease: user.disease,
      diseaseDuration: user.diseaseDuration,
      specialization: user.specialization,
      experience: user.experience,
      phone: user.phone,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
    res.status(201).json({
      user: userObj,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      height: user.height,
      weight: user.weight,
      age: user.age,
      disease: user.disease,
      diseaseDuration: user.diseaseDuration,
      specialization: user.specialization,
      experience: user.experience,
      phone: user.phone,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
    res.json({
      user: userObj,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      height: user.height,
      weight: user.weight,
      age: user.age,
      disease: user.disease,
      diseaseDuration: user.diseaseDuration,
      specialization: user.specialization,
      experience: user.experience,
      licenseNumber: user.licenseNumber,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
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

    const userObj = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      height: updatedUser.height,
      weight: updatedUser.weight,
      age: updatedUser.age,
      disease: updatedUser.disease,
      diseaseDuration: updatedUser.diseaseDuration,
      specialization: updatedUser.specialization,
      experience: updatedUser.experience,
      licenseNumber: updatedUser.licenseNumber,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
    };

    res.json({
      user: userObj,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const role = req.query.role;

  let query = {};
  if (role) {
    query.role = role;
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

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/auth/users/:id
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

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;

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
