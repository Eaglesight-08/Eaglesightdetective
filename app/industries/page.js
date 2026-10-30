import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { industries } from '@/lib/content';
import PageHead from '@/components/PageHead';
import ServiceIcon from '@/components/ServiceIcon';

export const metadata = {
  title: 'Industries',
  description: 'Cyber security, forensics and investigation support for banking, healthcare, legal, education, manufacturing, small businesses, government and individuals.',
};

export default function IndustriesPage() {
  return (
    <>
      <PageHead eyebrow="Industries" title="Every sector faces cyber crime. We know how each one works.">
        From hospitals to textile mills, law firms to families — we adapt our investigation and security work to the risks,
        regulations and people involved.
      </PageHead>

      <section className="section industries-dark spotlight">
        <div className="container grid-4">
          {industries.map((ind) => (
            <a key={ind.id} id={ind.id} href={`#${ind.id}`} className="card industry reveal" style={{ scrollMarginTop: 120 }}>
              <span className="icon-badge"><ServiceIcon name={ind.icon} /></span>
              <h3>{ind.title}</h3>
              <p>{ind.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="reveal">
            <span className="eyebrow">Not sure where you fit?</span>
            <h2>Tell us your situation — we will tell you honestly if we can help</h2>
            <p>A short call is usually enough to understand the problem, the urgency and the best next step. Consultations are confidential.</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-navy" data-magnetic>Book a consultation <ArrowRight /></Link>
              <Link href="/services" className="btn btn-outline">See services</Link>
            </div>
          </div>
          <div className="reveal faq-list">
            {['Fixed, written quotation before work starts', 'NDA signed before any casework', 'Evidence handled with documented chain of custody', 'Plain-language reports for non-technical readers'].map((t, i) => (
              <div key={t} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                <span className="step-num" style={{ fontSize: 30 }}>0{i + 1}</span>
                <b style={{ color: 'var(--navy-800)' }}>{t}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
