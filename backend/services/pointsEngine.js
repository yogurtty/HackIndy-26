/**
 * RANKED POINTS ENGINE
 *
 * Multiplier logic:
 * - Base multiplier = 1.0 (same level question as user level)
 * - Higher level question: +0.2 per level above (max 2.0 at 5 levels above)
 * - Lower level question: -0.2 per level below (min 0.2, never negative)
 * - Hot streak: every 5 consecutive correct answers adds +0.01 to multiplier
 *
 * Points per correct answer = BASE_POINTS * multiplier
 * Points lost per wrong answer = BASE_POINTS * multiplier * WRONG_PENALTY
 *
 * Level thresholds (total cumulative points):
 *   Lvl 1 →  Lvl 2:  100 pts
 *   Lvl 2 →  Lvl 3:  300 pts
 *   Lvl 3 →  Lvl 4:  600 pts
 *   Lvl 4 →  Lvl 5: 1000 pts
 */

const BASE_POINTS   = 10;
const WRONG_PENALTY = 0.5; // lose half what you would have earned
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000]; // index = level - 1

/**
 * Calculate the multiplier for a given answer.
 *
 * @param {number} userLevel       - User's current rank level (1–5)
 * @param {number} questionLevel   - Difficulty of the question (1–5)
 * @param {number} currentStreak   - Current consecutive correct answers
 * @returns {number} multiplier
 */
function calculateMultiplier(userLevel, questionLevel, currentStreak) {
  const levelDiff = questionLevel - userLevel;

  // Base multiplier shifts ±0.2 per level difference
  // Capped between 0.2 (min) and 2.0 (max)
  let multiplier = 1.0 + levelDiff * 0.2;
  multiplier = Math.max(0.2, Math.min(2.0, multiplier));

  // Hot streak bonus: +0.01 for every 5 consecutive correct answers
  // e.g. 5 correct = +0.01, 10 correct = +0.02, etc.
  const hotStreakBonus = Math.floor(currentStreak / 5) * 0.01;
  multiplier += hotStreakBonus;

  // Round to 2 decimal places to avoid floating point weirdness
  return Math.round(multiplier * 100) / 100;
}

/**
 * Process a single answer and return the points delta + updated streak.
 *
 * @param {object} params
 * @param {number} params.userLevel
 * @param {number} params.questionLevel
 * @param {number} params.currentStreak
 * @param {boolean} params.correct
 * @returns {{ pointsDelta: number, multiplier: number, newStreak: number }}
 */
function processAnswer({ userLevel, questionLevel, currentStreak, correct }) {
  const multiplier = calculateMultiplier(userLevel, questionLevel, currentStreak);
  let pointsDelta;
  let newStreak;

  if (correct) {
    pointsDelta = Math.round(BASE_POINTS * multiplier);
    newStreak   = currentStreak + 1; // keep building streak
  } else {
    // Losing points: penalized harder if punching down in level
    pointsDelta = -Math.round(BASE_POINTS * multiplier * WRONG_PENALTY);
    newStreak   = 0; // streak resets on wrong answer
  }

  return { pointsDelta, multiplier, newStreak };
}

/**
 * Check if a user should level up after a points update.
 * Returns the new level (same or higher).
 *
 * @param {number} totalPoints
 * @param {number} currentLevel
 * @returns {number} newLevel
 */
function checkLevelUp(totalPoints, currentLevel) {
  let newLevel = currentLevel;
  for (let i = currentLevel; i < 5; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) {
      newLevel = i + 1;
    }
  }
  return Math.min(newLevel, 5);
}

module.exports = { calculateMultiplier, processAnswer, checkLevelUp, LEVEL_THRESHOLDS };