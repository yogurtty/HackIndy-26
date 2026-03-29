const mongoose = require('mongoose');

// One document per user per day — tracks their session performance
const DailyLogSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:         { type: String, required: true }, // "2025-03-28"
  major:        { type: String },
  questionsAttempted: { type: Number, default: 0 },
  questionsCorrect:   { type: Number, default: 0 },
  pointsEarned:       { type: Number, default: 0 },
  // Array of question results for detailed review
  results: [{
    questionText: String,
    level:        Number, // question difficulty 1–5
    userLevel:    Number, // user's level at time of answer
    multiplier:   Number, // the calculated multiplier used
    correct:      Boolean,
    pointsDelta:  Number  // positive = earned, negative = lost
  }]
});

// Compound index so we can quickly look up a specific user's day
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', DailyLogSchema);