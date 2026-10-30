import { Check, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { company, services } from '@/lib/site';
import PageHead from '@/components/PageHead';
import ServiceIcon from '@/components/ServiceIcon';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Services',
  description: 'Cyber security & VAPT, digital forensics, investigation support, and ISO/IEC 27032 training & consulting.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHead
        eyebrow="Services"
        title="Cyber security & forensic services"
        actions={
          <>
            <a href="#enquiry" className="btn btn-navy">Start a confidential enquiry <ArrowRight /></a>
            <a href={company.phoneHref} className="btn btn-outline"><Phone /> {company.phone}</a>
          </>
        }
      >
        Defensive security, court-ready digital forensics and discreet investigations for businesses, legal teams and
        individuals across India.
      </PageHead>

      <section className="section" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="container">
          {services.map((s, i) => (
            <article key={s.id} id={s.id} className="service-detail">
              <aside className="reveal">
                <span className="icon-badge"><ServiceIcon name={s.icon} /></span>
                <div className="num" style={{ marginTop: 22 }}>PRACTICE 0{i + 1}</div>
                <h2>{s.title}</h2>
                <p>{s.intro}</p>
                <Link href={`/services/${s.id}`} className="link-arrow" style={{ marginTop: 18 }}>Full details <ArrowRight /></Link>
              </aside>
              <div className="reveal">
                <div className="detail-items">
                  {s.items.map(([t, d]) => (
                    <div key={t} className="detail-item">
                      <h4>{t}</h4>
                      <p>{d}</p>
                    </div>
                  ))}
                </div>
                <div className="deliverables">
                  <h4>What you receive</h4>
                  <ul>
                    {s.deliverables.map((d) => <li key={d}><Check /> {d}</li>)}
                  </ul>
                </div>
                {s.id === 'training-consulting' && (
                  <div style={{ marginTop: 20 }}>
                    <Link href="/academy" className="link-arrow">Explore the Cyber Academy <ArrowRight /></Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section ivory" id="enquiry" style={{ scrollMarginTop: 90 }}>
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Confidential engagement</span>
            <h2>Talk to an investigator</h2>
            <p>
              Every enquiry is reviewed by a senior investigator and kept strictly confidential. We sign an NDA before any
              casework begins and only act within a lawful, authorised mandate.
            </p>
            <ul className="ticks" style={{ marginTop: 24 }}>
              <li><Check /> Response from a senior investigator</li>
              <li><Check /> NDA signed before casework</li>
              <li><Check /> Clear scope and quotation up front</li>
            </ul>
          </div>
          <div className="reveal"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}
