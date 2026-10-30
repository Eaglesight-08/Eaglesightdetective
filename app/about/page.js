import Image from 'next/image';
import Link from 'next/link';
import { Users, Cpu, Eye, Flag, ArrowRight } from 'lucide-react';
import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';

export const metadata = {
  title: 'About',
  description: 'About Eaglesight Detective Services Private Limited — cyber investigation and digital forensics from Pollachi, Coimbatore.',
};

const pillars = [
  [Users, 'People', 'Experienced cyber investigators, certified forensic examiners and ethical hackers.'],
  [Cpu, 'Technology', 'Write-blockers, forensic workstations, RF sweep equipment and virtual training ranges.'],
  [Eye, 'Intelligence', 'Open-source intelligence, dark web monitoring and proactive threat hunting.'],
  [Flag, 'A Safer Digital India', 'A commitment to protecting Indian businesses and citizens from cyber crime.'],
];

export default function AboutPage() {
  return (
    <>
      <PageHead eyebrow="About us" title="Detective tradecraft for the digital age">
        Eaglesight Detective Services Private Limited is a cyber investigation and digital forensics firm headquartered in
        Pollachi, Coimbatore, Tamil Nadu.
      </PageHead>

      <section className="section">
        <div className="container split">
          <div className="reveal">
            <span className="eyebrow">Our purpose</span>
            <h2>Combining investigation with modern forensic science</h2>
            <p>
              We were founded on a simple belief: a digital India needs investigators who understand both people and
              technology. Our team blends traditional investigative methods with modern evidence recovery and security
              testing.
            </p>
            <p>
              Whether we are helping a company uncover data theft, supporting counsel in litigation or securing an
              organisation’s systems, our work follows documented procedures that keep evidence intact and admissible under
              Indian law.
            </p>
            <blockquote style={{ marginTop: 28, paddingLeft: 20, borderLeft: '3px solid var(--gold-500)', fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--navy-800)', fontWeight: 600 }}>
              “Skilled detectives for a safer digital world.”
            </blockquote>
          </div>
          <div className="photo-frame reveal from-right">
            <div className="photo">
              <Image src="/images/command_center.jpg" alt="Eaglesight operations centre" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow center">Our four pillars</span>
            <h2>People · Technology · Intelligence</h2>
          </div>
          <div className="grid-4">
            {pillars.map(([Icon, title, text]) => (
              <div key={title} className="card reveal" style={{ textAlign: 'center' }}>
                <span className="icon-badge" style={{ margin: '0 auto' }}><Icon /></span>
                <h3 style={{ fontSize: 20 }}>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="reveal">
            <span className="eyebrow">Company details</span>
            <h2>Registered and certified</h2>
            <p>
              Eaglesight Detective Services Private Limited is incorporated under the Companies Act, 2013 with the Ministry of
              Corporate Affairs and certified to {company.iso}.
            </p>
            <dl className="facts" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 28 }}>
              <div className="fact"><dt>CIN</dt><dd style={{ fontSize: 16 }}>{company.cin}</dd></div>
              <div className="fact"><dt>Standard</dt><dd style={{ fontSize: 16 }}>{company.iso}</dd></div>
              <div className="fact" style={{ borderLeft: 0, borderTop: '1px solid var(--line)' }}><dt>State</dt><dd style={{ fontSize: 16 }}>Tamil Nadu, India</dd></div>
              <div className="fact" style={{ borderTop: '1px solid var(--line)' }}><dt>Headquarters</dt><dd style={{ fontSize: 16 }}>Pollachi, Coimbatore</dd></div>
            </dl>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-navy">Contact us <ArrowRight /></Link>
            </div>
          </div>
          <div className="reveal">
            <Image
              src="/images/official_brand_doc.jpg"
              alt="Eaglesight official letterhead"
              width={904}
              height={1280}
              style={{ width: '100%', maxWidth: 440, height: 'auto', margin: '0 auto', borderRadius: 6, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--line)' }}
            />
          </div>
        </div>
      </section>

    </>
  );
}
