'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import { services } from '@/lib/site';

const images = {
  'cyber-security': '/images/command_center.jpg',
  'digital-forensics': '/images/forensics_lab.jpg',
  'investigation-support': '/images/command_center.jpg',
  'training-consulting': '/images/cyber_academy.jpg',
};

const AUTO_MS = 7000;

// Tabbed service showcase that auto-advances until the visitor picks a tab.
export default function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % services.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, auto]);

  const s = services[active];

  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="Our services">
        {services.map((svc, i) => (
          <button
            key={svc.id}
            role="tab"
            aria-selected={i === active}
            className={`explorer-tab${i === active ? ' active' : ''}`}
            onClick={() => { setActive(i); setAuto(false); }}
          >
            <span className="icon-badge sm"><ServiceIcon name={svc.icon} /></span>
            <span className="explorer-tab-text">
              <b>{svc.title}</b>
              <small>{svc.lead}</small>
            </span>
            {i === active && auto && <span className="explorer-progress" style={{ animationDuration: `${AUTO_MS}ms` }} />}
          </button>
        ))}
      </div>

      <div className="explorer-panel" role="tabpanel" key={s.id}>
        <div className="explorer-media">
          <Image src={images[s.id]} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
          <span className="explorer-num">0{active + 1}</span>
        </div>
        <div className="explorer-body">
          <span className="eyebrow">Practice 0{active + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.intro}</p>
          <ul className="ticks">
            {s.items.map(([t, d]) => (
              <li key={t}><Check /> <span><b>{t}.</b> {d}</span></li>
            ))}
          </ul>
          <Link href={`/services/${s.id}`} className="btn btn-navy">
            Explore {s.title} <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
