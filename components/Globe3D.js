'use client';

import { useEffect, useRef } from 'react';

// Pollachi HQ plus cities our network arcs travel to (lat, lon).
const HQ = [10.66, 77.0];
const CITIES = [
  [28.61, 77.21], [19.08, 72.88], [22.57, 88.36],
  [25.2, 55.27], [1.35, 103.82], [51.5, -0.12], [40.71, -74.0], [35.68, 139.69], [-33.87, 151.2], [50.11, 8.68],
];

const toRad = (d) => (d * Math.PI) / 180;
const latLonToVec = (lat, lon) => {
  const la = toRad(lat), lo = toRad(lon);
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

// Spherical interpolation between two unit vectors, lifted off the surface for an arc.
function arcPoints(a, b, steps = 48) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const s = Math.sin(omega) || 1;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const k1 = Math.sin((1 - t) * omega) / s, k2 = Math.sin(t * omega) / s;
    const lift = 1 + Math.sin(Math.PI * t) * Math.min(0.16, 0.05 + omega * 0.06);
    pts.push([(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift]);
  }
  return pts;
}

export default function Globe3D({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fibonacci sphere of dots
    const N = 1800;
    const dots = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      dots.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const hq = latLonToVec(...HQ);
    const arcs = CITIES.map((c, i) => ({ pts: arcPoints(hq, latLonToVec(...c)), end: latLonToVec(...c), offset: i * 0.37 }));

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let rotY = toRad(-77 - 30), rotX = toRad(8);
    let targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0;
    let t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const project = (v, cy, sy, cx, sx, R, cxp, cyp) => {
      // rotate around Y then X
      let x = v[0] * cy + v[2] * sy;
      let z = -v[0] * sy + v[2] * cy;
      let y = v[1] * cx - z * sx;
      z = v[1] * sx + z * cx;
      const persp = 6 / (6 - z);
      return [cxp + x * R * persp, cyp - y * R * persp, z, persp];
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      if (!reduce) rotY += 0.0022;
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      const ry = rotY + tiltY, rx = rotX + tiltX;
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const R = Math.min(w, h) * 0.345;
      const cxp = w / 2, cyp = h / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // soft halo
      const halo = ctx.createRadialGradient(cxp, cyp, R * 0.85, cxp, cyp, R * 1.35);
      halo.addColorStop(0, 'rgba(216,178,90,0.18)');
      halo.addColorStop(1, 'rgba(216,178,90,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cxp, cyp, R * 1.35, 0, Math.PI * 2); ctx.fill();

      // sphere body
      const body = ctx.createRadialGradient(cxp - R * 0.35, cyp - R * 0.4, R * 0.1, cxp, cyp, R * 1.05);
      body.addColorStop(0, 'rgba(255,255,255,0.95)');
      body.addColorStop(1, 'rgba(232,226,212,0.55)');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cxp, cyp, R * 1.02, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(195,148,54,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // dots
      for (const d of dots) {
        const [px, py, z, p] = project(d, cy, sy, cx, sx, R, cxp, cyp);
        const front = z > 0;
        const a = front ? 0.25 + z * 0.6 : 0.06 + (1 + z) * 0.05;
        ctx.fillStyle = `rgba(26,42,80,${a})`;
        const s = (front ? 2 : 1.2) * p;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }

      // meridian ring
      ctx.strokeStyle = 'rgba(195,148,54,0.25)';
      ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.ellipse(cxp, cyp, R * 1.18, R * 0.34, -0.35, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // arcs with travelling pulses
      for (const arc of arcs) {
        const proj = arc.pts.map((p) => project(p, cy, sy, cx, sx, R, cxp, cyp));
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        let started = false;
        for (const [px, py, z] of proj) {
          if (z < -0.15) { started = false; continue; }
          if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(195,148,54,0.55)';
        ctx.stroke();

        const prog = ((t * 0.35 + arc.offset) % 1.4) / 1.4;
        const idx = Math.floor(prog * (proj.length - 1));
        const head = proj[idx];
        if (head && head[2] > -0.15) {
          const g = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 7);
          g.addColorStop(0, 'rgba(243,220,154,1)');
          g.addColorStop(1, 'rgba(195,148,54,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(head[0], head[1], 7, 0, Math.PI * 2); ctx.fill();
        }
        const e = project(arc.end, cy, sy, cx, sx, R, cxp, cyp);
        if (e[2] > 0) {
          ctx.fillStyle = '#1a2a50';
          ctx.beginPath(); ctx.arc(e[0], e[1], 2.6, 0, Math.PI * 2); ctx.fill();
        }
      }

      // HQ beacon
      const H = project(hq, cy, sy, cx, sx, R, cxp, cyp);
      if (H[2] > -0.1) {
        const pulse = (t % 2) / 2;
        ctx.strokeStyle = `rgba(195,148,54,${1 - pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(H[0], H[1], 4 + pulse * 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#c39436';
        ctx.beginPath(); ctx.arc(H[0], H[1], 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0b1530';
        ctx.font = '600 11px Manrope, system-ui, sans-serif';
        ctx.fillText('POLLACHI HQ', H[0] + 10, H[1] - 8);
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = nx * 0.6;
      targetTiltX = ny * 0.25;
    };
    const onLeave = () => { targetTiltX = 0; targetTiltY = 0; };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener('pointermove', onPointer, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-label="Animated globe showing Eaglesight's network from Pollachi" role="img" />;
}
