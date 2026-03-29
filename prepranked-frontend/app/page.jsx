'use client';
import { useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0a0a0a;
    --surface:  #111111;
    --border:   #1f1f1f;
    --gold:     #f5a623;
    --gold-dim: #7a5212;
    --text:     #e8e8e8;
    --muted:    #555;
    --danger:   #e05252;
    --mono:     'IBM Plex Mono', monospace;
    --display:  'Bebas Neue', sans-serif;
    --body:     'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--body); min-height: 100vh; }

  .page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Left Panel ── */
  .left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    overflow: hidden;
  }

  .left::before {
    content: '';
    position: absolute;
    top: -100px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .logo {
    font-family: var(--display);
    font-size: 28px;
    letter-spacing: 3px;
    color: var(--gold);
    position: relative;
  }

  .hero-text {
    position: relative;
  }

  .hero-text h1 {
    font-family: var(--display);
    font-size: clamp(64px, 8vw, 96px);
    line-height: 0.9;
    letter-spacing: 2px;
    color: var(--text);
    margin-bottom: 24px;
  }

  .hero-text h1 span { color: var(--gold); }

  .hero-text p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 340px;
    font-weight: 300;
  }

  .stats-row {
    display: flex;
    gap: 32px;
    position: relative;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 600;
    color: var(--gold);
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
  }

  /* ── Right Panel ── */
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .form-card {
    width: 100%;
    max-width: 400px;
  }

  .tab-row {
    display: flex;
    gap: 0;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--border);
  }

  .tab {
    flex: 1;
    padding: 14px;
    background: none;
    border: none;
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s;
    position: relative;
  }

  .tab.active {
    color: var(--gold);
  }

  .tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
  }

  .field {
    margin-bottom: 20px;
  }

  .field label {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field input, .field select {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 12px 16px;
    font-family: var(--body);
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }

  .field input:focus, .field select:focus {
    border-color: var(--gold);
  }

  .field select { cursor: pointer; }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: var(--gold);
    border: none;
    color: #000;
    font-family: var(--display);
    font-size: 22px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    margin-top: 8px;
  }

  .submit-btn:hover { opacity: 0.9; }
  .submit-btn:active { transform: scale(0.99); }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .error-msg {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--danger);
    margin-top: 12px;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .divider span {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .rank-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .select-wrapper {
    position: relative;
    width: 100%;
  }
  .chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 12px;
  }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 1px;
    padding: 4px 10px;
    border: 1px solid var(--gold-dim);
    color: var(--gold-dim);
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    .page { grid-template-columns: 1fr; }
    .left { display: none; }
  }
`;

const MAJORS = ['Computer Science','Electrical Engineering','Mechanical Engineering',
  'Data Science','Finance','Business','Biology','Chemistry','Physics','Other'];

export default function LoginPage() {
  const [tab, setTab]         = useState('login');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor]     = useState('');
  const [role, setRole]       = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit() {
    setError(''); setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login'
        ? { email, password }
        : { email, password, major, targetRole: role, targetCompany: company };

      const res  = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {/* Left panel */}
        <div className="left">
          <div className="grid-lines" />
          <div className="logo">PREPRANKED</div>
          <div className="hero-text">
            <h1>LEVEL<br/>UP YOUR<br/><span>INTERVIEW</span><br/>GAME.</h1>
            <p>AI-powered questions from real interviews. Ranked system. Voice feedback. Compete and climb.</p>
            <div className="rank-badges" style={{marginTop: 24}}>
              {['Applicant','Candidate','Contender','Expert','Elite'].map(t => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
          </div>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">10K+</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-num">5</span>
              <span className="stat-label">Rank Tiers</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="right">
          <div className="form-card">
            <div className="tab-row">
              <button className={`tab${tab==='login'?' active':''}`} onClick={()=>{setTab('login');setError('')}}>Login</button>
              <button className={`tab${tab==='register'?' active':''}`} onClick={()=>{setTab('register');setError('')}}>Register</button>
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" />
            </div>

            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {tab === 'register' && <>
              <div className="field">
                <label>Major</label>
		<div className="select-wrapper">
                <select value={major} onChange={e=>setMajor(e.target.value)}>
                  <option value="">Select your major</option>
                  {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
		<span className="chevron">▼</span>
              </div>
              </div>
              <div className="field">
                <label>Target Role</label>
                <input value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
              <div className="field">
                <label>Target Company</label>
                <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="e.g. Google" />
              </div>
            </>}

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'LOADING...' : tab === 'login' ? 'ENTER' : 'CREATE ACCOUNT'}
            </button>
            {error && <div className="error-msg">⚠ {error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
