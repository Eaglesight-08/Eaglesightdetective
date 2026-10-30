import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Check, ArrowRight, Phone } from 'lucide-react';
import { company, services, workflow } from '@/lib/site';
import PageHead from '@/components/PageHead';
import ServiceIcon from '@/components/ServiceIcon';
import EnquiryForm from '@/components/EnquiryForm';

const images = {
  'cyber-security': '/images/command_center.jpg',
  'digital-forensics': '/images/forensics_lab.jpg',
  'investigation-support': '/images/command_center.jpg',
  'training-consulting': '/images/cyber_academy.jpg',
};

const whoFor = {
  'cyber-security': ['Companies launching or running web and mobile apps', 'Banks, fintechs and payment providers', 'Organisations preparing for audits or certification', 'Businesses after a near-miss or breach'],
  'digital-forensics': ['Advocates and law firms preparing evidence', 'Companies investigating misconduct or fraud', 'Individuals who need chats or media recovered', 'Police and investigating agencies'],
  'investigation-support': ['Employers facing data theft or leaks', 'Boards and HR teams handling sensitive allegations', 'Executives worried about surveillance', 'Victims of extortion and online fraud'],
  'training-consulting': ['Leadership teams and boards', 'IT and compliance teams', 'Students and working professionals', 'Police, legal and government personnel'],
};

// Every slug is prerendered from generateStaticParams, so a blocking route is fine.
export const instant = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  return s ? { title: s.title, description: s.lead } : {};
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const index = services.findIndex((x) => x.id === slug);
  if (index === -1) notFound();
  const s = services[index];
  const others = services.filter((x) => x.id !== slug);

  return (
    <>
      <PageHead
        eyebrow={`Services · Practice 0${index + 1}`}
        title={s.title}
        actions={
          <>
            <a href="#enquiry" className="btn btn-navy" data-magnetic>Discuss your case <ArrowRight /></a>
            <a href={company.phoneHref} className="btn btn-outline"><Phone /> {company.phone}</a>
          </>
        }
      >
        {s.lead}
      </PageHead>

      <section className="section">
        <div className="container split">
          <div className="reveal from-left">
            <span className="icon-badge"><ServiceIcon name={s.icon} /></span>
            <h2 style={{ marginTop: 22 }}>Overview</h2>
            <p>{s.intro}</p>
            <div className="deliverables" style={{ marginTop: 28 }}>
              <h4>What you receive</h4>
              <ul>{s.deliverables.map((d) => <li key={d}><Check /> {d}</li>)}</ul>
            </div>
          </div>
          <div className="photo-frame reveal from-right">
            <div className="photo">
              <Image src={images[s.id]} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Capabilities</span>
            <h2>What this practice covers</h2>
          </div>
          <div className="grid-2">
            {s.items.map(([t, d], i) => (
              <div key={t} className="card reveal">
                <div className="step-num" style={{ fontSize: 34 }}>0{i + 1}</div>
                <h3 style={{ marginTop: 8 }}>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section navy spotlight">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Who it is for</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', margin: '14px 0 20px' }}>Built for people who need answers they can rely on</h2>
            <ul className="ticks">
              {whoFor[s.id].map((w) => <li key={w} style={{ color: '#d5dbe8' }}><Check /> {w}</li>)}
            </ul>
          </div>
          <div className="reveal">
            <span className="eyebrow">How an engagement runs</span>
            <ol style={{ listStyle: 'none', display: 'grid', gap: 18, marginTop: 20 }}>
              {['Free, confidential consultation', 'NDA and written scope with a fixed quotation', ...workflow.slice(1, 3).map(([t]) => t), 'Clear report and follow-up support'].map((t, i) => (
                <li key={t} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: 'var(--gold-400)', width: 40 }}>0{i + 1}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section ivory" id="enquiry" style={{ scrollMarginTop: 90 }}>
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Other practices</span>
            <h2>Explore more services</h2>
            <div className="contact-list" style={{ marginTop: 24 }}>
              {others.map((o) => (
                <Link key={o.id} href={`/services/${o.id}`} className="contact-item">
                  <span className="icon-badge sm"><ServiceIcon name={o.icon} /></span>
                  <div><h4>{o.title}</h4><p style={{ fontWeight: 500, fontSize: 14.5, color: 'var(--muted)' }}>{o.lead}</p></div>
                </Link>
              ))}
            </div>
          </div>
          <div className="reveal"><EnquiryForm title={`Enquire about ${s.title}`} /></div>
        </div>
      </section>
    </>
  );
}
