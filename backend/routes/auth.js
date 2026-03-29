/**
 * Auth Routes
 *
 * POST /api/auth/register  — create a new user account
 * POST /api/auth/login     — login and receive a JWT
 *
 * JWT docs:    https://github.com/auth0/node-jsonwebtoken
 * bcrypt docs: https://github.com/dcodeIO/bcrypt.js
 */

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// ── Helper: sign a JWT for a user ──────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/auth/register ─────────────────────────────────────────────────
// Body: { email, password, major, targetRole?, targetCompany? }
router.post('/register', async (req, res) => {
  try {
    const { email, password, major, targetRole, targetCompany } = req.body;

    // Basic validation
    if (!email || !password || !major) {
      return res.status(400).json({ error: 'Email, password, and major are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already in use
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    // Create user — the pre('save') hook in User.js will hash the password
    const user = new User({
      email:         email.toLowerCase(),
      passwordHash:  password, // gets hashed by the mongoose hook
      major,
      targetRole:    targetRole    || '',
      targetCompany: targetCompany || '',
    });

    await user.save();

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id:            user._id,
        email:         user.email,
        major:         user.major,
        targetRole:    user.targetRole,
        targetCompany: user.targetCompany,
        level:         user.level,
        totalPoints:   user.totalPoints,
        activeTitle:   user.activeTitle,
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password using the method defined in User.js
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id:            user._id,
        email:         user.email,
        major:         user.major,
        targetRole:    user.targetRole,
        targetCompany: user.targetCompany,
        level:         user.level,
        totalPoints:   user.totalPoints,
        seasonPoints:  user.seasonPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        activeTitle:   user.activeTitle,
        isPremium:     user.isPremium,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
