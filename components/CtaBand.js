import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import { company } from '@/lib/site';

export default function CtaBand({
  title = 'Facing a cyber incident right now?',
  text = 'Do not switch off affected devices. Call our 24/7 helpline and a forensic investigator will guide you.',
}) {
  return (
    <section className="cta-band">
      <div className="container">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="actions">
          <a href={company.phoneHref} className="btn btn-gold"><Phone /> Call {company.phone}</a>
          <Link href="/incident-response" className="btn btn-light">First steps <ArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}
