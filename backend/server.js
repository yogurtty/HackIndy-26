/**
 * Main Express server
 *
 * Express docs:  https://expressjs.com/en/4x/api.html
 * Mongoose docs: https://mongoosejs.com/docs/connections.html
 */

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/interview', require('./routes/interview'));
app.use('/api/auth', require('./routes/auth'));
// TODO: add /api/auth, /api/forum, /api/resume, /api/leaderboard

// ── Database connection ─────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(4000, () => console.log('🚀 Server running on :4000'));
    
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });