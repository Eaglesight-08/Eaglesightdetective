import { MapPin, Phone, Mail, Globe, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Contact',
  description: 'Contact Eaglesight Detective Services, Pollachi, Coimbatore — phone, email and registered address.',
};

export default function ContactPage() {
  return (
    <>
      <PageHead eyebrow="Contact" title="Speak with an investigator">
        Reach our investigators, forensic lab or academy admissions. In-person visits to our Pollachi office are by
        appointment.
      </PageHead>

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Get in touch</span>
            <h2>Eaglesight Detective Services Private Limited</h2>
            <div className="contact-list" style={{ marginTop: 28 }}>
              <a href={company.mapsHref} target="_blank" rel="noopener noreferrer" className="contact-item">
                <span className="icon-badge sm"><MapPin /></span>
                <div>
                  <h4>Registered / mailing address</h4>
                  <p>{company.addressLines.map((l) => <span key={l} style={{ display: 'block' }}>{l}</span>)}</p>
                </div>
              </a>
              <a href={company.phoneHref} className="contact-item">
                <span className="icon-badge sm"><Phone /></span>
                <div><h4>Phone · 24/7</h4><span>{company.phone}</span></div>
              </a>
              <a href={`mailto:${company.email}`} className="contact-item">
                <span className="icon-badge sm"><Mail /></span>
                <div><h4>Email</h4><span>{company.email}</span></div>
              </a>
              <a href={`https://${company.website}`} className="contact-item">
                <span className="icon-badge sm"><Globe /></span>
                <div><h4>Website</h4><span>{company.website}</span></div>
              </a>
            </div>

            <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--danger)', padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 19, display: 'flex', gap: 10, alignItems: 'center' }}>
                <AlertTriangle size={20} color="var(--danger)" /> Active ransomware or extortion?
              </h3>
              <p style={{ marginTop: 8 }}>Don’t wait for an email reply — call us now and keep affected devices powered on.</p>
              <div style={{ marginTop: 14 }}>
                <Link href="/incident-response" className="link-arrow">What to do right now <ArrowRight /></Link>
              </div>
            </div>
          </div>

          <div className="reveal">
            <EnquiryForm title="Send us a message" />
          </div>
        </div>
      </section>
    </>
  );
}
