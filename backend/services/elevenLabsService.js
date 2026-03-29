/**
 * ElevenLabs Text-to-Speech Service
 *
 * Used to voice:
 * - Interview questions (the AI "interviewer")
 * - Real-time feedback after each answer
 * - Daily encouragement / streak notifications
 *
 * ElevenLabs API docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 * Supported voices:    https://api.elevenlabs.io/v1/voices
 *
 * We stream the audio back to the frontend as a base64 buffer
 * so the browser can play it immediately without saving to disk.
 */

const axios = require('axios'); // https://axios-http.com/docs/intro
require('dotenv').config();

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

/**
 * Convert text to speech and return audio as a Buffer.
 *
 * @param {string} text           The text to speak
 * @param {string} [voiceId]      Override default voice
 * @param {object} [settings]     Voice settings override
 * @returns {Promise<Buffer>}     Raw MP3 audio buffer
 */
async function textToSpeech(text, voiceId, settings = {}) {
  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID;

  const response = await axios.post(
    `${ELEVENLABS_BASE}/text-to-speech/${voice}`,
    {
      text,
      model_id: 'eleven_monolingual_v1', // fastest model
      voice_settings: {
        stability:        settings.stability        ?? 0.5,
        similarity_boost: settings.similarity_boost ?? 0.75,
        style:            settings.style            ?? 0.2,
        use_speaker_boost: true
      }
    },
    {
      headers: {
        'xi-api-key':   process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept':       'audio/mpeg'
      },
      responseType: 'arraybuffer' // get raw binary
    }
  );

  return Buffer.from(response.data);
}

/**
 * Generate feedback text for a user's answer, then voice it.
 * Called after the user submits their response to a question.
 *
 * @param {object} params
 * @param {string} params.question      The original question
 * @param {string} params.userAnswer    What the user said
 * @param {boolean} params.correct      Whether it was graded correct
 * @param {string} params.tip           The tip from Gemini for this question
 * @returns {Promise<{ feedbackText: string, audioBase64: string }>}
 */
async function generateVoiceFeedback({ question, userAnswer, correct, tip }) {
  // Build a short feedback script
  const feedbackText = correct
    ? `Great answer! ${tip} Keep it up.`
    : `Good attempt. Here's what interviewers look for: ${tip} Try to incorporate that next time.`;

  const audioBuffer = await textToSpeech(feedbackText);
  const audioBase64 = audioBuffer.toString('base64');

  return { feedbackText, audioBase64 };
}

module.exports = { textToSpeech, generateVoiceFeedback };