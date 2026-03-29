'use client';
import { useState } from 'react';

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
    --silver:  #a0a0b0;
    --bronze:  #cd7f32;
    --text:    #e8e8e8;
    --muted:   #555;
    --green:   #4caf7d;
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

  .nav { padding: 24px 0; flex: 1; }

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

  /* ── Main ── */
  .main { padding: 40px 48px; }

  .page-header {
    margin-bottom: 36px;
  }

  .page-header h1 {
    font-family: var(--display);
    font-size: 56px;
    letter-spacing: 3px;
    line-height: 1;
  }

  .page-header p {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
    margin-top: 6px;
  }

  /* ── Filter tabs ── */
  .filter-row {
    display: flex;
    gap: 0;
    margin-bottom: 32px;
    border-bottom: 1px solid var(--border);
  }

  .filter-tab {
    padding: 10px 24px;
    background: none;
    border: none;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.15s;
    position: relative;
  }

  .filter-tab.active { color: var(--gold); }

  .filter-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
  }

  /* ── Podium ── */
  .podium {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 40px;
    align-items: end;
  }

  .podium-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .podium-card:hover { transform: translateY(-2px); }

  .podium-card.first {
    border-color: var(--gold);
    background: linear-gradient(180deg, rgba(245,166,35,0.08) 0%, var(--surface) 60%);
    padding-top: 32px;
  }

  .podium-card.second { border-color: var(--silver); order: -1; }
  .podium-card.third  { border-color: var(--bronze); }

  .podium-rank {
    font-family: var(--display);
    font-size: 52px;
    letter-spacing: 2px;
    line-height: 1;
    margin-bottom: 4px;
  }

  .first  .podium-rank { color: var(--gold); }
  .second .podium-rank { color: var(--silver); }
  .third  .podium-rank { color: var(--bronze); }

  .podium-name {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-pts {
    font-family: var(--mono);
    font-size: 20px;
    font-weight: 600;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .podium-title {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* ── Table ── */
  .table-header {
    display: grid;
    grid-template-columns: 60px 1fr 120px 100px 100px;
    padding: 10px 20px;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
  }

  .table-row {
    display: grid;
    grid-template-columns: 60px 1fr 120px 100px 100px;
    padding: 14px 20px;
    align-items: center;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: default;
  }

  .table-row:hover { background: var(--surface2); }

  .table-row.is-you {
    background: rgba(245,166,35,0.06);
    border-left: 2px solid var(--gold);
  }

  .rank-num {
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 600;
    color: var(--muted);
  }

  .rank-num.top { color: var(--gold); }

  .player-info { display: flex; flex-direction: column; gap: 2px; }

  .player-name {
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 600;
  }

  .player-meta {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.5px;
  }

  .player-title {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid var(--border);
    color: var(--muted);
    display: inline-block;
  }

  .player-title.elite   { border-color: var(--gold-dim); color: var(--gold); }
  .player-title.expert  { border-color: #4a4a7a; color: #8888cc; }

  .pts-cell {
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 600;
    color: var(--gold);
    text-align: right;
  }

  .streak-cell {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--green);
    text-align: right;
  }

  .you-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 1px;
    padding: 2px 6px;
    background: rgba(245,166,35,0.15);
    color: var(--gold);
    border: 1px solid var(--gold-dim);
    margin-left: 8px;
    vertical-align: middle;
  }
`;

const MOCK_LEADERBOARD = [
  { rank: 1,  name: 'sarah_k',    title: 'Elite',      titleClass: 'elite',  pts: 1482, streak: 34, major: 'CS',       you: false },
  { rank: 2,  name: 'devraj99',   title: 'Expert',     titleClass: 'expert', pts: 1201, streak: 21, major: 'EE',        you: false },
  { rank: 3,  name: 'mgomez',     title: 'Expert',     titleClass: 'expert', pts: 987,  streak: 15, major: 'CS',        you: false },
  { rank: 4,  name: 'you',        title: 'Candidate',  titleClass: '',       pts: 187,  streak: 7,  major: 'CS',        you: true  },
  { rank: 5,  name: 'lchen22',    title: 'Candidate',  titleClass: '',       pts: 176,  streak: 3,  major: 'Finance',   you: false },
  { rank: 6,  name: 'priya_m',    title: 'Candidate',  titleClass: '',       pts: 155,  streak: 9,  major: 'Data Sci',  you: false },
  { rank: 7,  name: 'jakobw',     title: 'Applicant',  titleClass: '',       pts: 134,  streak: 0,  major: 'Mech Eng',  you: false },
  { rank: 8,  name: 'nate_x',     title: 'Applicant',  titleClass: '',       pts: 112,  streak: 5,  major: 'CS',        you: false },
  { rank: 9,  name: 'aaliyah_t',  title: 'Applicant',  titleClass: '',       pts: 98,   streak: 2,  major: 'Biology',   you: false },
  { rank: 10, name: 'rjohnson',   title: 'Applicant',  titleClass: '',       pts: 81,   streak: 0,  major: 'Physics',   you: false },
];

export default function Leaderboard() {
  const [tab, setTab] = useState('season');
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest  = MOCK_LEADERBOARD.slice(3);

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">PREPRANKED</div>
          <nav className="nav">
            {[
              { icon: '▣', label: 'Dashboard',   href: '/dashboard' },
              { icon: '◈', label: 'Interview',    href: '/interview' },
              { icon: '◉', label: 'Leaderboard',  href: '/leaderboard', active: true },
              { icon: '◎', label: 'Profile',      href: '/profile' },
            ].map(item => (
              <a key={item.label} href={item.href} className={`nav-item${item.active ? ' active' : ''}`}>
                <span>{item.icon}</span> {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="main">
          <div className="page-header">
            <h1>LEADERBOARD</h1>
            <p>// ranked by season points — resets monthly</p>
          </div>

          <div className="filter-row">
            {['season', 'all-time', 'major'].map(t => (
              <button key={t} className={`filter-tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>
                {t === 'all-time' ? 'All Time' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Podium */}
          <div className="podium">
            {[top3[1], top3[0], top3[2]].map((p, i) => {
              const cls = i === 0 ? 'second' : i === 1 ? 'first' : 'third';
              const medal = i === 0 ? '🥈' : i === 1 ? '🥇' : '🥉';
              return (
                <div key={p.rank} className={`podium-card ${cls}`}>
                  <div className="podium-rank">{medal}</div>
                  <div className="podium-name">{p.name}</div>
                  <div className="podium-pts">{p.pts.toLocaleString()}</div>
                  <div className="podium-title">{p.title} · {p.streak}🔥</div>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Title</span>
            <span style={{textAlign:'right'}}>Points</span>
            <span style={{textAlign:'right'}}>Streak</span>
          </div>

          {rest.map(p => (
            <div key={p.rank} className={`table-row${p.you ? ' is-you' : ''}`}>
              <div className={`rank-num${p.rank <= 3 ? ' top' : ''}`}>#{p.rank}</div>
              <div className="player-info">
                <div className="player-name">
                  {p.name}
                  {p.you && <span className="you-badge">YOU</span>}
                </div>
                <div className="player-meta">{p.major}</div>
              </div>
              <div>
                <span className={`player-title ${p.titleClass}`}>{p.title}</span>
              </div>
              <div className="pts-cell">{p.pts.toLocaleString()}</div>
              <div className="streak-cell">{p.streak > 0 ? `${p.streak}🔥` : '—'}</div>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}
