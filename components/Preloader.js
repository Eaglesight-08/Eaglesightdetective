'use client';

import { useEffect, useState } from 'react';

// Branded loading screen shown on a full page load. A longer intro plays once per
// browser session; later full loads get a quick fade. Client navigations never show it.
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading → leaving → gone

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('esds-intro') === '1'; sessionStorage.setItem('esds-intro', '1'); } catch {}
    const minTime = seen ? 350 : 1700;
    const start = Date.now();
    let loaded = document.readyState === 'complete';
    let leaveTimer;
    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad);

    // Timers (not rAF) so the loader still finishes in background tabs.
    const interval = setInterval(() => {
      const timeP = Math.min(1, (Date.now() - start) / minTime);
      const target = loaded ? timeP : Math.min(timeP, 0.9);
      setPct(Math.round(target * 100));
      if (target >= 1) {
        clearInterval(interval);
        setPhase('leaving');
        document.documentElement.classList.add('loaded');
        leaveTimer = setTimeout(() => setPhase('gone'), 900);
      }
    }, 40);
    // Never trap the visitor behind the loader.
    const failsafe = setTimeout(() => { loaded = true; }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
      clearTimeout(leaveTimer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`preloader${phase === 'leaving' ? ' leaving' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-seal">
          <svg viewBox="0 0 120 120" className="preloader-ring">
            <circle cx="60" cy="60" r="56" className="track" />
            <circle cx="60" cy="60" r="56" className="bar" style={{ strokeDashoffset: 352 - (352 * pct) / 100 }} />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/eagle_logo_clean.png" alt="" width="96" height="96" />
        </div>
        <div className="preloader-name">
          {'EAGLESIGHT'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${0.25 + i * 0.06}s` }}>{c}</span>)}
        </div>
        <div className="preloader-tag">CYBER DETECTIVES</div>
        <div className="preloader-pct">{String(pct).padStart(2, '0')}%</div>
      </div>
      <div className="preloader-panel top" />
      <div className="preloader-panel bottom" />
    </div>
  );
}
