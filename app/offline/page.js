import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, Phone, Home } from 'lucide-react';
import { company } from '@/lib/site';

export const metadata = { title: 'You are offline', robots: { index: false } };

export default function OfflinePage() {
  return (
    <section className="status-page">
      <Image src="/images/eagle_mark.png" alt="" width={600} height={380} className="hero-watermark" aria-hidden="true" />
      <div className="container" style={{ position: 'relative' }}>
        <div className="status-icon"><WifiOff /></div>
        <span className="eyebrow center">No connection</span>
        <h1>You are offline</h1>
        <p>
          This page isn’t saved on your device yet. Check your internet connection and try again. Pages you have already
          visited still work offline.
        </p>
        <p style={{ marginTop: 14 }}>
          Emergency? Call us directly on <a href={company.phoneHref} style={{ color: 'var(--gold-600)', fontWeight: 700 }}>{company.phone}</a>.
        </p>
        <div className="hero-actions">
          <Link href="/" className="btn btn-navy"><Home /> Go to home</Link>
          <a href={company.phoneHref} className="btn btn-outline"><Phone /> Call helpline</a>
        </div>
      </div>
    </section>
  );
}
