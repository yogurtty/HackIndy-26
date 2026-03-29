/**
 * Interview Routes
 *
 * POST /api/interview/generate  — generate questions for a session
 * POST /api/interview/answer    — submit an answer, get points + voice feedback
 *
 * JWT middleware docs: https://github.com/auth0/node-jsonwebtoken
 */

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const DailyLog = require('../models/DailyLog');
const { generateInterviewQuestions } = require('../services/geminiService');
const { generateVoiceFeedback }      = require('../services/elevenLabsService');
const { processAnswer, checkLevelUp } = require('../services/pointsEngine');

// ── Auth middleware ─────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ── POST /api/interview/generate ────────────────────────────────────────────
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { targetRole, targetCompany, count = 10 } = req.body;

    const questions = await generateInterviewQuestions({
      major:         user.major,
      targetRole:    targetRole || user.targetRole,
      targetCompany: targetCompany || user.targetCompany,
      userLevel:     user.level,
      count
    });

    res.json({ questions, userLevel: user.level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/interview/answer ───────────────────────────────────────────────
// Body: { questionText, questionLevel, correct, userAnswer, tip }
router.post('/answer', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { questionText, questionLevel, correct, userAnswer, tip } = req.body;

    // ── 1. Calculate points using the engine ─────────────────────
    const { pointsDelta, multiplier, newStreak } = processAnswer({
      userLevel:     user.level,
      questionLevel: parseInt(questionLevel),
      currentStreak: user.currentStreak,
      correct
    });

    // ── 2. Update user stats ─────────────────────────────────────
    user.totalPoints  = Math.max(0, user.totalPoints  + pointsDelta);
    user.seasonPoints = Math.max(0, user.seasonPoints + pointsDelta);
    user.currentStreak = newStreak;
    if (newStreak > user.longestStreak) user.longestStreak = newStreak;

    // Check for level up
    const newLevel = checkLevelUp(user.totalPoints, user.level);
    const leveledUp = newLevel > user.level;
    user.level = newLevel;
    user.lastActiveDate = new Date();
    await user.save();

    // ── 3. Log to DailyLog ───────────────────────────────────────
    const today = new Date().toISOString().split('T')[0]; // "2025-03-28"
    await DailyLog.findOneAndUpdate(
      { userId: user._id, date: today },
      {
        $inc: { questionsAttempted: 1, questionsCorrect: correct ? 1 : 0, pointsEarned: pointsDelta },
        $push: { results: { questionText, level: questionLevel, userLevel: user.level, multiplier, correct, pointsDelta } },
        $setOnInsert: { major: user.major }
      },
      { upsert: true, new: true }
    );

    // ── 4. Generate voice feedback via ElevenLabs ────────────────
    const { feedbackText, audioBase64 } = await generateVoiceFeedback({
      question: questionText, userAnswer, correct, tip
    });

    res.json({
      pointsDelta,
      multiplier,
      newStreak,
      totalPoints: user.totalPoints,
      level:       user.level,
      leveledUp,
      feedbackText,
      audioBase64  // frontend plays this as MP3
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;