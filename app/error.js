'use client'; // Error boundaries must be Client Components

import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({ retry }) {
  return (
    <section className="status-page">
      <div className="container" style={{ position: 'relative' }}>
        <div className="status-icon"><AlertTriangle /></div>
        <span className="eyebrow center">Something went wrong</span>
        <h1>We hit an unexpected problem</h1>
        <p>Please try again. If it keeps happening, call us on +91 73053 73567 or email eaglesightteam@gmail.com.</p>
        <div className="hero-actions">
          <button type="button" className="btn btn-navy" onClick={() => retry?.()}><RefreshCw /> Try again</button>
          <Link href="/" className="btn btn-outline"><Home /> Home</Link>
        </div>
      </div>
    </section>
  );
}
