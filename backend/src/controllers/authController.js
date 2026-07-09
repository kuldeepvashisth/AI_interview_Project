const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Input Validation Schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret_for_dev_only', {
    expiresIn: '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production, false in development
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });

  return token;
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Validate request body
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMsg });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Set cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      resumeText: user.resumeText
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ error: 'Server error during user registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMsg });
    }

    const { email, password } = validation.data;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Set cookie
    generateTokenAndSetCookie(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      resumeText: user.resumeText
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is already populated by protect middleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      resumeText: req.user.resumeText
    });
  } catch (error) {
    console.error('GetMe Error:', error.message);
    res.status(500).json({ error: 'Server error fetching user details' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe
};
