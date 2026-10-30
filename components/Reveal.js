'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

// Fallback for browsers without CSS scroll-driven animations: fades in `.reveal`
// elements (and draws `.steps` lines) via IntersectionObserver. It waits for the
// page to finish loading so it never changes markup while React is hydrating.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (supportsScrollTimeline()) return;
    let io;
    let timer;
    const start = () => {
      const els = document.querySelectorAll('.reveal:not(.in), .steps:not(.in)');
      if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('in'));
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
    };
    const defer = () => { timer = setTimeout(start, 300); };
    if (document.readyState === 'complete') defer();
    else window.addEventListener('load', defer, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', defer);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
