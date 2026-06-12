const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, club, rollNo, className, section } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'Email already registered and verified.' });
      }
      // If not verified, we can allow them to resend OTP or update details, but for simplicity, we'll just update OTP
      const otp = generateOTP();
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      // Update details in case they changed name/password before verifying
      existingUser.name = name;
      existingUser.password = password; // Will be re-hashed by pre-save
      
      await existingUser.save();

      // Send OTP
      await sendEmail({
        email: existingUser.email,
        subject: 'CampusV2 Email Verification',
        message: `Your verification code is: ${otp}\nThis code expires in 10 minutes.`,
      });

      return res.status(200).json({ message: 'OTP sent to email. Please verify.' });
    }

    // New user
    const otp = generateOTP();
    const userData = { 
      name, 
      email, 
      password, 
      role: role || 'student', 
      rollNo, 
      className, 
      section,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    if (role === 'organizer' && club) {
      userData.club = club;
    }

    const user = await User.create(userData);

    // Send OTP email
    try {
      await sendEmail({
        email: user.email,
        subject: 'CampusV2 Email Verification',
        message: `Your verification code is: ${otp}\nThis code expires in 10 minutes.`,
      });
      res.status(201).json({ message: 'Registration successful. Please verify your OTP.' });
    } catch (err) {
      console.error('Email sending failed', err);
      // Even if email fails, user is created but unverified. In production we'd handle this better.
      res.status(500).json({ message: 'Error sending OTP email.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).populate('club');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please register again to get a new OTP.' });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Login user automatically after verification
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      club: user.club,
      rollNo: user.rollNo,
      className: user.className,
      section: user.section,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('club');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      club: user.club,
      rollNo: user.rollNo,
      className: user.className,
      section: user.section,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('club').select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email }).populate('club');

    if (user) {
      // If user exists but doesn't have googleId linked, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Auto-verify if they login with Google
        await user.save();
      } else if (!user.isVerified) {
         user.isVerified = true; // Auto-verify if they login with Google
         await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        role: 'student', // Default role
        isVerified: true // Google accounts are pre-verified
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      club: user.club,
      rollNo: user.rollNo,
      className: user.className,
      section: user.section,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = { register, login, getMe, googleLogin, verifyOTP };
