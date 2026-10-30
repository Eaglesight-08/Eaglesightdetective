'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supportsScrollTimeline } from './Reveal';

// Site-wide micro-interactions, wired by data attributes so pages stay server components:
//   data-magnetic   element leans toward the pointer
//   data-count      number counts up when scrolled into view (fallback; CSS does this where supported)
//   data-parallax   moves at a fraction of scroll speed (fallback; CSS does this where supported)
//   .spotlight      radial light follows the pointer (--sx/--sy)
export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cssScroll = supportsScrollTimeline();
    const cleanups = [];

    // Count-up numbers
    const counters = cssScroll ? [] : document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const end = Number(el.dataset.count);
        if (reduce) return;
        const dur = 1600, t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(end * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    // Start after load so text never changes while React is hydrating.
    let countTimer;
    const startCounters = () => { countTimer = setTimeout(() => counters.forEach((c) => io.observe(c)), 300); };
    if (document.readyState === 'complete') startCounters();
    else window.addEventListener('load', startCounters, { once: true });
    cleanups.push(() => { io.disconnect(); clearTimeout(countTimer); window.removeEventListener('load', startCounters); });

    if (!reduce && fine) {
      // Magnetic buttons
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const move = (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
        };
        const leave = () => { el.style.transform = ''; };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });

      // Spotlight
      document.querySelectorAll('.spotlight').forEach((el) => {
        const move = (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--sx', `${e.clientX - r.left}px`);
          el.style.setProperty('--sy', `${e.clientY - r.top}px`);
        };
        el.addEventListener('pointermove', move);
        cleanups.push(() => el.removeEventListener('pointermove', move));
      });
    }

    // Parallax
    if (!reduce && !cssScroll) {
      const items = [...document.querySelectorAll('[data-parallax]')];
      if (items.length) {
        let raf = 0;
        const update = () => {
          raf = 0;
          const vh = window.innerHeight;
          items.forEach((el) => {
            const r = el.getBoundingClientRect();
            const offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax || 0.08);
            el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
          });
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
