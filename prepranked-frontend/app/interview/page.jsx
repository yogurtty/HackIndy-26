'use client';
import { useState, useEffect, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0a0a0a;
    --surface: #111111;
    --surface2:#161616;
    --border:  #1f1f1f;
    --gold:    #f5a623;
    --gold-dim:#7a5212;
    --text:    #e8e8e8;
    --muted:   #555;
    --green:   #4caf7d;
    --red:     #e05252;
    --mono:    'IBM Plex Mono', monospace;
    --display: 'Bebas Neue', sans-serif;
    --body:    'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--body); min-height: 100vh; }

  .page { max-width: 860px; margin: 0 auto; padding: 48px 24px; }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .back {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--muted);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.15s;
  }
  .back:hover { color: var(--text); }

  .session-meta {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
    text-align: right;
  }

  /* ── Setup screen ── */
  .setup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 40px;
    position: relative;
    overflow: hidden;
  }

  .setup-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }

  .setup-title {
    font-family: var(--display);
    font-size: 48px;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  .setup-sub {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
    margin-bottom: 36px;
  }

  .setup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }

  .field label {
    display: block;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field input, .field select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 12px 16px;
    font-family: var(--body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }

  .field input:focus, .field select:focus { border-color: var(--gold); }

  .start-btn {
    width: 100%;
    padding: 16px;
    background: var(--gold);
    border: none;
    color: #000;
    font-family: var(--display);
    font-size: 26px;
    letter-spacing: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .start-btn:hover { opacity: 0.88; }
  .start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Question card ── */
  .progress-bar {
    height: 3px;
    background: var(--border);
    margin-bottom: 32px;
  }

  .progress-fill {
    height: 100%;
    background: var(--gold);
    transition: width 0.4s ease;
  }

  .q-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .q-counter {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 2px;
  }

  .q-meta {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .tag {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid var(--border);
    color: var(--muted);
  }

  .tag.gold { border-color: var(--gold-dim); color: var(--gold); }

  .q-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 32px;
    margin-bottom: 24px;
    position: relative;
  }

  .q-text {
    font-size: 18px;
    line-height: 1.7;
    font-weight: 300;
    margin-bottom: 0;
  }

  .answer-box {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 20px;
    font-family: var(--body);
    font-size: 15px;
    line-height: 1.6;
    resize: vertical;
    min-height: 140px;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 16px;
  }

  .answer-box:focus { border-color: var(--gold); }

  .action-row {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .btn-secondary {
    padding: 12px 24px;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-secondary:hover { border-color: var(--text); color: var(--text); }

  .btn-primary {
    padding: 12px 28px;
    background: var(--gold);
    border: none;
    color: #000;
    font-family: var(--display);
    font-size: 20px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Feedback overlay ── */
  .feedback-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 28px 32px;
    margin-bottom: 24px;
    border-left: 3px solid var(--green);
    animation: slideIn 0.3s ease;
  }

  .feedback-card.wrong { border-left-color: var(--red); }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .feedback-result {
    font-family: var(--display);
    font-size: 32px;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  .feedback-result.correct { color: var(--green); }
  .feedback-result.wrong   { color: var(--red); }

  .feedback-text {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
    font-weight: 300;
    margin-bottom: 16px;
  }

  .points-delta {
    font-family: var(--mono);
    font-size: 20px;
    font-weight: 600;
  }

  .points-delta.pos { color: var(--green); }
  .points-delta.neg { color: var(--red); }

  .feedback-stats {
    display: flex;
    gap: 24px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .fb-stat {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .fb-stat span { color: var(--text); }

  /* ── Results screen ── */
  .results-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .results-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--gold);
  }

  .results-title {
    font-family: var(--display);
    font-size: 64px;
    letter-spacing: 4px;
    color: var(--gold);
    margin-bottom: 8px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin: 32px 0;
    text-align: left;
  }

  .result-stat {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 20px;
  }

  .result-stat .label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .result-stat .val {
    font-family: var(--mono);
    font-size: 36px;
    font-weight: 600;
    color: var(--gold);
  }

  .play-again-btn {
    padding: 16px 48px;
    background: var(--gold);
    border: none;
    color: #000;
    font-family: var(--display);
    font-size: 24px;
    letter-spacing: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .play-again-btn:hover { opacity: 0.88; }
`;

// Mock questions — replace with real API call
const MOCK_QUESTIONS = [
  { question: 'Tell me about a time you had to debug a complex system issue under time pressure. What was your process?', level: 2, category: 'behavioral', tip: 'Use STAR format — they want to see structured thinking under pressure, not just the outcome.' },
  { question: 'Design a URL shortening service like bit.ly. Walk me through your approach.', level: 3, category: 'system-design', tip: 'Cover: hashing strategy, DB schema, caching layer, and how you handle collisions.' },
  { question: 'What is the time complexity of finding the kth largest element in an unsorted array, and how would you optimize it?', level: 3, category: 'technical', tip: 'Mention QuickSelect O(n) average vs sorting O(n log n). Min-heap O(n log k) is another valid approach.' },
];

export default function InterviewSession() {
  const [phase, setPhase]             = useState('setup'); // setup | session | results
  const [targetRole, setTargetRole]   = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [count, setCount]             = useState(5);
  const [questions, setQuestions]     = useState([]);
  const [qIndex, setQIndex]           = useState(0);
  const [answer, setAnswer]           = useState('');
  const [feedback, setFeedback]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, points: 0, streak: 0 });
  const audioRef = useRef(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function startSession() {
    setLoading(true);
    try {
      // Uncomment when auth is ready:
      // const res = await fetch('http://localhost:4000/api/interview/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ targetRole, targetCompany, count })
      // });
      // const data = await res.json();
      // setQuestions(data.questions);
      setQuestions(MOCK_QUESTIONS); // remove once auth is wired
      setPhase('session');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(correct) {
    setLoading(true);
    const q = questions[qIndex];
    try {
      // Uncomment when auth is ready:
      // const res = await fetch('http://localhost:4000/api/interview/answer', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ questionText: q.question, questionLevel: q.level, correct, userAnswer: answer, tip: q.tip })
      // });
      // const data = await res.json();

      // Mock response for now
      const data = {
        pointsDelta:  correct ? 12 : -6,
        multiplier:   1.2,
        newStreak:    correct ? sessionStats.streak + 1 : 0,
        feedbackText: correct ? `Great answer! ${q.tip} Keep it up.` : `Good attempt. ${q.tip}`,
        audioBase64:  null
      };

      setFeedback({ ...data, correct });
      setSessionStats(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        points:  prev.points + data.pointsDelta,
        streak:  data.newStreak
      }));

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
        audio.play();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    setFeedback(null);
    setAnswer('');
    if (qIndex + 1 >= questions.length) {
      setPhase('results');
    } else {
      setQIndex(i => i + 1);
    }
  }

  function restart() {
    setPhase('setup');
    setQIndex(0);
    setAnswer('');
    setFeedback(null);
    setSessionStats({ correct: 0, points: 0, streak: 0 });
  }

  const q = questions[qIndex];
  const progress = questions.length ? ((qIndex + (feedback ? 1 : 0)) / questions.length) * 100 : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <a href="/dashboard" className="back">← Dashboard</a>
          {phase === 'session' && (
            <div className="session-meta">
              <div>{sessionStats.correct} correct &nbsp;|&nbsp; {sessionStats.points >= 0 ? '+' : ''}{sessionStats.points} pts</div>
              <div>streak: {sessionStats.streak}🔥</div>
            </div>
          )}
        </div>

        {/* Setup */}
        {phase === 'setup' && (
          <div className="setup-card">
            <div className="setup-title">NEW SESSION</div>
            <div className="setup-sub">// configure your interview practice round</div>
            <div className="setup-grid">
              <div className="field">
                <label>Target Role</label>
                <input value={targetRole} onChange={e=>setTargetRole(e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
              <div className="field">
                <label>Target Company</label>
                <input value={targetCompany} onChange={e=>setTargetCompany(e.target.value)} placeholder="e.g. Google" />
              </div>
              <div className="field">
                <label>Question Count</label>
                <select value={count} onChange={e=>setCount(Number(e.target.value))}>
                  {[5,10,15,20].map(n => <option key={n} value={n}>{n} questions</option>)}
                </select>
              </div>
            </div>
            <button className="start-btn" onClick={startSession} disabled={loading}>
              {loading ? 'GENERATING...' : 'BEGIN INTERVIEW'}
            </button>
          </div>
        )}

        {/* Session */}
        {phase === 'session' && q && (
          <>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="q-header">
              <div className="q-counter">
                QUESTION {qIndex + 1} / {questions.length}
              </div>
              <div className="q-meta">
                <span className="tag">{q.category}</span>
                <span className="tag gold">LVL {q.level}</span>
              </div>
            </div>

            <div className="q-card">
              <p className="q-text">{q.question}</p>
            </div>

            {!feedback && (
              <>
                <textarea
                  className="answer-box"
                  value={answer}
                  onChange={e=>setAnswer(e.target.value)}
                  placeholder="Type your answer here, or use the buttons below to self-grade..."
                />
                <div className="action-row">
                  <button className="btn-secondary" onClick={()=>submitAnswer(false)} disabled={loading}>
                    ✗ INCORRECT
                  </button>
                  <button className="btn-primary" onClick={()=>submitAnswer(true)} disabled={loading}>
                    ✓ CORRECT
                  </button>
                </div>
              </>
            )}

            {feedback && (
              <>
                <div className={`feedback-card${feedback.correct ? '' : ' wrong'}`}>
                  <div className={`feedback-result${feedback.correct ? ' correct' : ' wrong'}`}>
                    {feedback.correct ? 'CORRECT' : 'INCORRECT'}
                  </div>
                  <div className="feedback-text">{feedback.feedbackText}</div>
                  <div className={`points-delta ${feedback.pointsDelta >= 0 ? 'pos' : 'neg'}`}>
                    {feedback.pointsDelta >= 0 ? '+' : ''}{feedback.pointsDelta} pts
                  </div>
                  <div className="feedback-stats">
                    <div className="fb-stat">Multiplier: <span>×{feedback.multiplier}</span></div>
                    <div className="fb-stat">Streak: <span>{feedback.newStreak}🔥</span></div>
                  </div>
                </div>
                <div className="action-row">
                  <button className="btn-primary" onClick={nextQuestion}>
                    {qIndex + 1 >= questions.length ? 'SEE RESULTS' : 'NEXT →'}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Results */}
        {phase === 'results' && (
          <div className="results-card">
            <div className="results-title">SESSION COMPLETE</div>
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 13, letterSpacing: 1 }}>
              // {new Date().toLocaleDateString()}
            </div>
            <div className="results-grid">
              <div className="result-stat">
                <div className="label">Score</div>
                <div className="val">{sessionStats.correct}/{questions.length}</div>
              </div>
              <div className="result-stat">
                <div className="label">Points Earned</div>
                <div className="val" style={{ color: sessionStats.points >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {sessionStats.points >= 0 ? '+' : ''}{sessionStats.points}
                </div>
              </div>
              <div className="result-stat">
                <div className="label">Peak Streak</div>
                <div className="val">{sessionStats.streak}🔥</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button className="play-again-btn" onClick={restart}>PLAY AGAIN</button>
              <a href="/dashboard" style={{ padding: '16px 32px', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 2, textDecoration: 'none', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}>
                Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
