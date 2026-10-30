'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

// Gold reading-progress bar along the top edge plus a back-to-top button.
export default function ScrollFx() {
  const bar = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.current?.style.setProperty('--p', p.toFixed(4));
      setShow(window.scrollY > 700);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={bar} className="scroll-progress" aria-hidden="true" />
      <button
        className={`to-top${show ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={show ? 0 : -1}
      >
        <ArrowUp />
      </button>
    </>
  );
}
