'use client';
import { useState, useEffect } from 'react';

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

  .layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-logo {
    font-family: var(--display);
    font-size: 22px;
    letter-spacing: 3px;
    color: var(--gold);
    padding: 0 24px 32px;
    border-bottom: 1px solid var(--border);
  }

  .nav {
    padding: 24px 0;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    border-left: 2px solid transparent;
  }

  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(245,166,35,0.05); }

  .sidebar-bottom {
    padding: 24px;
    border-top: 1px solid var(--border);
  }

  .wallet-badge {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 1px;
    padding: 8px 12px;
    border: 1px solid var(--gold-dim);
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .wallet-badge:hover { background: rgba(245,166,35,0.08); }

  /* ── Main ── */
  .main {
    padding: 40px 48px;
    overflow-y: auto;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }

  .greeting h2 {
    font-family: var(--display);
    font-size: 42px;
    letter-spacing: 2px;
    line-height: 1;
  }

  .greeting h2 span { color: var(--gold); }

  .greeting p {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    margin-top: 6px;
    letter-spacing: 1px;
  }

  .start-btn {
    background: var(--gold);
    color: #000;
    border: none;
    padding: 14px 28px;
    font-family: var(--display);
    font-size: 20px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: opacity 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .start-btn:hover { opacity: 0.85; }

  /* ── Rank Card ── */
  .rank-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 28px 32px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
  }

  .rank-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }

  .rank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .rank-title {
    font-family: var(--display);
    font-size: 36px;
    letter-spacing: 3px;
    color: var(--gold);
  }

  .rank-level {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .progress-track {
    background: var(--border);
    height: 6px;
    position: relative;
    margin-bottom: 10px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dim), var(--gold));
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    right: -1px; top: -3px;
    width: 2px; height: 12px;
    background: var(--gold);
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 20px 24px;
  }

  .stat-card .label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .stat-card .value {
    font-family: var(--mono);
    font-size: 32px;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
  }

  .stat-card .value.gold { color: var(--gold); }
  .stat-card .value.green { color: var(--green); }

  .stat-card .sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }

  /* ── Bottom Grid ── */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px;
  }

  .panel-title {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  /* Streak calendar */
  .streak-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .streak-day {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
  }

  .streak-day.active { background: var(--gold); border-color: var(--gold); color: #000; }
  .streak-day.done   { background: rgba(245,166,35,0.15); border-color: var(--gold-dim); color: var(--gold-dim); }

  /* Recent sessions */
  .session-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }

  .session-row:last-child { border-bottom: none; }

  .session-date {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }

  .session-pts {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 600;
  }

  .pos { color: var(--green); }
  .neg { color: var(--red); }
`;

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];
const RANK_NAMES = ['', 'Applicant', 'Candidate', 'Contender', 'Expert', 'Elite'];

// Mock data — replace with real API calls
const mockUser = {
  email: 'alex@university.edu',
  major: 'Computer Science',
  level: 2,
  totalPoints: 187,
  seasonPoints: 87,
  currentStreak: 7,
  longestStreak: 12,
  targetRole: 'Software Engineer',
  targetCompany: 'Google',
  activeTitle: 'Candidate',
  isPremium: false,
};

const mockSessions = [
  { date: '2025-03-28', attempted: 10, correct: 8, points: +64 },
  { date: '2025-03-27', attempted: 8,  correct: 5, points: +28 },
  { date: '2025-03-26', attempted: 12, correct: 4, points: -12 },
  { date: '2025-03-25', attempted: 6,  correct: 6, points: +50 },
];

function getLevelProgress(totalPoints, level) {
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next    = LEVEL_THRESHOLDS[level]     ?? LEVEL_THRESHOLDS[level - 1];
  if (level >= 5) return 100;
  return Math.round(((totalPoints - current) / (next - current)) * 100);
}

export default function Dashboard() {
  const [user] = useState(mockUser);
  const progress = getLevelProgress(user.totalPoints, user.level);
  const nextThreshold = LEVEL_THRESHOLDS[user.level] ?? '—';

  // Build a 28-day streak grid
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    const isToday   = i === 27;
    const hasStreak = i >= (28 - user.currentStreak);
    return { label: d.getDate(), active: isToday, done: hasStreak && !isToday };
  });

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">PREPRANKED</div>
          <nav className="nav">
            {[
              { icon: '▣', label: 'Dashboard', href: '/dashboard', active: true },
              { icon: '◈', label: 'Interview',  href: '/interview' },
              { icon: '◉', label: 'Leaderboard',href: '/leaderboard' },
              { icon: '◎', label: 'Profile',    href: '/profile' },
            ].map(item => (
              <a key={item.label} href={item.href} className={`nav-item${item.active ? ' active' : ''}`}>
                <span>{item.icon}</span> {item.label}
              </a>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="wallet-badge">
              🔗 {user.isPremium ? 'Premium Active' : 'Connect Wallet'}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          {/* Top bar */}
          <div className="top-bar">
            <div className="greeting">
              <h2>WELCOME BACK, <span>{user.email.split('@')[0].toUpperCase()}</span></h2>
              <p>// {user.targetRole} → {user.targetCompany} &nbsp;|&nbsp; {user.major}</p>
            </div>
            <a href="/interview" className="start-btn">START SESSION</a>
          </div>

          {/* Rank card */}
          <div className="rank-card">
            <div className="rank-header">
              <div>
                <div className="rank-title">{RANK_NAMES[user.level]}</div>
                <div className="rank-level">Rank Level {user.level} / 5</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 600, color: 'var(--gold)' }}>
                  {user.totalPoints.toLocaleString()}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                  TOTAL POINTS
                </div>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-labels">
              <span>{user.totalPoints} pts</span>
              <span>{progress}% to {RANK_NAMES[Math.min(user.level + 1, 5)]}</span>
              <span>{nextThreshold} pts</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">Season Points</div>
              <div className="value gold">{user.seasonPoints}</div>
              <div className="sub">resets monthly</div>
            </div>
            <div className="stat-card">
              <div className="label">Current Streak</div>
              <div className="value green">{user.currentStreak}🔥</div>
              <div className="sub">consecutive correct</div>
            </div>
            <div className="stat-card">
              <div className="label">Longest Streak</div>
              <div className="value">{user.longestStreak}</div>
              <div className="sub">all time</div>
            </div>
            <div className="stat-card">
              <div className="label">Active Title</div>
              <div className="value" style={{ fontSize: 20, paddingTop: 6 }}>{user.activeTitle}</div>
              <div className="sub">{user.targetRole}</div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="bottom-grid">
            <div className="panel">
              <div className="panel-title">// 28-day activity</div>
              <div className="streak-row">
                {days.map((d, i) => (
                  <div key={i} className={`streak-day${d.active ? ' active' : d.done ? ' done' : ''}`}>
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title">// recent sessions</div>
              {mockSessions.map((s, i) => (
                <div key={i} className="session-row">
                  <div>
                    <div className="session-date">{s.date}</div>
                    <div style={{ fontSize: 13, marginTop: 2 }}>{s.correct}/{s.attempted} correct</div>
                  </div>
                  <div className={`session-pts ${s.points >= 0 ? 'pos' : 'neg'}`}>
                    {s.points >= 0 ? '+' : ''}{s.points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
