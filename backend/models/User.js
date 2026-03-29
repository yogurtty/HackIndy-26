// Mongoose docs: https://mongoosejs.com/docs/guide.html
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // https://github.com/dcodeIO/bcrypt.js

const UserSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  major:        { type: String, required: true }, // e.g. "Computer Science"
  targetRole:   { type: String },                 // e.g. "Software Engineer"
  targetCompany:{ type: String },                 // e.g. "Google"

  // ── Ranked System ──────────────────────────────────────────────
  // Each user has a level 1–5. Points determine level thresholds.
  // Level thresholds: 100, 300, 600, 1000, 1500 (cumulative)
  level:          { type: Number, default: 1, min: 1, max: 5 },
  totalPoints:    { type: Number, default: 0 },
  seasonPoints:   { type: Number, default: 0 }, // resets monthly

  // ── Streak Tracking ────────────────────────────────────────────
  // streakCount = consecutive correct answers
  // hotStreak fires every 5 correct in a row, adds +0.01 to multiplier
  currentStreak:  { type: Number, default: 0 },
  longestStreak:  { type: Number, default: 0 },
  lastActiveDate: { type: Date },               // for daily streak logic

  // ── Titles & Cosmetics ─────────────────────────────────────────
  // Titles earned through season performance or challenges
  titleEarned:    [{ type: String }],
  activeTitle:    { type: String, default: 'Applicant' },
  profileTheme:   { type: String, default: 'default' },

  // ── Membership (Solana) ────────────────────────────────────────
  // We check wallet ownership on-chain; no private keys stored here
  // Phantom wallet docs: https://docs.phantom.app
  walletAddress:  { type: String },
  isPremium:      { type: Boolean, default: false },
  premiumExpiry:  { type: Date },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
// bcryptjs docs: https://github.com/dcodeIO/bcrypt.js#readme
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);