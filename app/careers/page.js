import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { roles } from '@/lib/content';
import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Careers',
  description: 'Join Eaglesight Detective Services — careers in digital forensics, penetration testing and cyber investigation.',
};

const perks = [
  'Work on real cases under experienced investigators',
  'Hands-on time in a working forensic laboratory',
  'Training and certification through our academy',
  'A small team where your work is seen and matters',
];

export default function CareersPage() {
  return (
    <>
      <PageHead
        eyebrow="Careers"
        title="Do work that protects people"
        actions={<a href="#apply" className="btn btn-navy" data-magnetic>Apply now <ArrowRight /></a>}
      >
        We are building a team of careful, curious investigators. If you care about getting the facts right, we would like to
        hear from you.
      </PageHead>

      <section className="section">
        <div className="container split">
          <div className="reveal from-left">
            <span className="eyebrow">Why Eaglesight</span>
            <h2>Learn fast, on real casework</h2>
            <ul className="ticks">{perks.map((p) => <li key={p}><Check /> {p}</li>)}</ul>
          </div>
          <div className="photo-frame reveal from-right">
            <div className="photo"><Image src="/images/cyber_academy.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Openings</span>
            <h2>Roles we are hiring for</h2>
            <p>Don’t see your role? Send a general application — we keep strong profiles on file.</p>
          </div>
          <div className="faq-list">
            {roles.map(([title, meta, text]) => (
              <div key={title} className="card role reveal">
                <div>
                  <div className="meta">{meta}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <a href="#apply" className="btn btn-outline">Apply <ArrowRight /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="apply" style={{ scrollMarginTop: 90 }}>
        <div className="container narrow">
          <EnquiryForm
            title="Apply to join the team"
            intro="Tell us about yourself and the role you are interested in. Please mention your experience and attach your CV when the email opens."
            topics={[...roles.map(([t]) => t), 'General application']}
            submitLabel="Send application"
          />
        </div>
      </section>
    </>
  );
}
