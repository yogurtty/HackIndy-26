/**
 * Gemini AI — Interview Question Generator
 *
 * Uses Google's Gemini API with grounding (web search) enabled
 * to pull real interview questions from:
 * - Reddit (r/cscareerquestions, r/experienceddevs)
 * - Glassdoor-style Q&A
 * - Official company engineering blogs
 *
 * Gemini API docs:    https://ai.google.dev/gemini-api/docs
 * Grounding docs:     https://ai.google.dev/gemini-api/docs/grounding
 * Node.js SDK:        https://github.com/google/generative-ai-js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate interview questions for a specific major, role, and company.
 * Questions are tagged with a difficulty level 1–5.
 *
 * @param {object} params
 * @param {string} params.major         e.g. "Computer Science"
 * @param {string} params.targetRole    e.g. "Software Engineer"
 * @param {string} params.targetCompany e.g. "Google"
 * @param {number} params.userLevel     1–5, used to weight question difficulty
 * @param {number} params.count         how many questions to generate
 * @returns {Promise<Array>} array of { question, level, category, source }
 */
async function generateInterviewQuestions({
  major,
  targetRole,
  targetCompany,
  userLevel = 1,
  count = 10
}) {
  // Use the gemini-2.0-flash model — fast and supports grounding
  // Model list: https://ai.google.dev/gemini-api/docs/models
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    tools: [{ googleSearch: {} }] // enables web grounding
  });

  const prompt = `
You are an expert technical interview coach for STEM professionals.

Generate ${count} real interview questions for:
- Major/Field: ${major}
- Target Role: ${targetRole}
- Target Company: ${targetCompany}
- Candidate Level: ${userLevel} out of 5 (1=entry, 5=senior/staff)

Search the web for REAL questions that people have reported from interviews at ${targetCompany},
including sources like Reddit (r/cscareerquestions, r/leetcode), Glassdoor, and engineering blogs.

Return ONLY a JSON array. Each object must have:
{
  "question": "the full question text",
  "level": 1-5 (difficulty: 1=easy, 5=very hard),
  "category": "behavioral | technical | system-design | coding",
  "tip": "one sentence on what the interviewer is really looking for"
}

Weight the difficulty: generate mostly level ${userLevel} questions,
with a few at level ${Math.min(userLevel + 1, 5)} to challenge the candidate.
`.trim();

  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  // Strip markdown code fences if Gemini wraps the JSON
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini JSON parse error:', err);
    // Return a safe fallback so the app doesn't crash
    return [{ question: text, level: userLevel, category: 'general', tip: '' }];
  }
}

module.exports = { generateInterviewQuestions };