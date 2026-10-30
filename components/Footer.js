import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, ArrowRight, ArrowUpRight, Siren, Clock, BadgeCheck } from 'lucide-react';
import { company, services } from '@/lib/site';
import { industries } from '@/lib/content';
import NewsletterForm from './NewsletterForm';

const cols = [
  ['Services', [...services.map((s) => [`/services/${s.id}`, s.title]), ['/incident-response', 'Incident response'], ['/academy', 'Cyber Academy']]],
  ['Industries', industries.slice(0, 6).map((i) => [`/industries#${i.id}`, i.title])],
  ['Resources', [['/insights', 'Insights & guides'], ['/resources', 'Cyber help desk'], ['/faq', 'FAQ'], ['/insights/ransomware-first-hour', 'Ransomware checklist'], ['/insights/spot-whatsapp-scams', 'Scam awareness']]],
  ['Company', [['/about', 'About us'], ['/careers', 'Careers'], ['/contact', 'Contact'], ['/privacy-policy', 'Privacy policy'], ['/terms', 'Terms of service']]],
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Pre-footer call to action */}
      <div className="prefooter">
        <div className="container">
          <div className="prefooter-card spotlight">
            <div>
              <span className="eyebrow">Confidential consultation</span>
              <h2>Have a case? Talk to an investigator today.</h2>
              <p>Tell us what happened. We respond quickly, sign an NDA before casework, and give you a clear plan and quotation.</p>
            </div>
            <div className="prefooter-actions">
              <Link href="/contact" className="btn btn-gold" data-magnetic>Book a consultation <ArrowRight /></Link>
              <a href={company.phoneHref} className="btn btn-light"><Phone /> {company.phone}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Letterhead contact band */}
      <div className="footer-contact">
        <div className="container">
          <a className="fc-item" href={company.mapsHref} target="_blank" rel="noopener noreferrer">
            <span className="fc-icon"><MapPin /></span>
            <div><h4>Registered / Mailing Address</h4><p>{company.addressLines.join(' ')}</p></div>
          </a>
          <a className="fc-item" href={company.phoneHref}>
            <span className="fc-icon"><Phone /></span>
            <div><h4>Phone</h4><p>{company.phone}</p></div>
          </a>
          <a className="fc-item" href={`mailto:${company.email}`}>
            <span className="fc-icon"><Mail /></span>
            <div><h4>Email</h4><p>{company.email}</p></div>
          </a>
          <a className="fc-item" href={`https://${company.website}`}>
            <span className="fc-icon"><Globe /></span>
            <div><h4>Website</h4><p>{company.website}</p></div>
          </a>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-brand-row">
                <Image src="/images/eagle_logo_clean.png" alt="Eaglesight seal" width={140} height={140} />
                <div>
                  <div className="name">Eaglesight Detective Services Private Limited</div>
                  <div className="ftag">CYBER DETECTIVES</div>
                </div>
              </div>
              <p>
                People · Technology · Intelligence · A Safer Digital India. Cyber security, digital forensics and
                investigation support from Pollachi, Coimbatore — for clients across India.
              </p>
              <div className="footer-badges">
                <span><BadgeCheck /> {company.iso}</span>
                <span><Clock /> 24/7 incident helpline</span>
              </div>
            </div>

            <div className="footer-news">
              <h4>Cyber safety newsletter</h4>
              <p>Practical alerts on new scams and threats, plus academy batch dates. No spam.</p>
              <NewsletterForm />
              <div className="footer-emergency">
                <Siren />
                <div>
                  <b>Lost money to online fraud?</b>
                  <span>Call the national helpline <a href="tel:1930">1930</a> immediately, then contact us.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-cols">
            {cols.map(([title, links]) => (
              <div className="footer-col" key={title}>
                <h4>{title}</h4>
                <ul>
                  {links.map(([href, label]) => (
                    <li key={href + label}><Link href={href}>{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="footer-col">
              <h4>Visit us</h4>
              <ul>
                <li>{company.addressLines[0]}</li>
                <li>{company.addressLines[1]}</li>
                <li>{company.addressLines[2]}</li>
                <li><a href={company.mapsHref} target="_blank" rel="noopener noreferrer">Open in Google Maps <ArrowUpRight size={14} /></a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">EAGLESIGHT</div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>© 2026 Eaglesight Detective Services Private Limited · CIN {company.cin}</span>
          <div className="mark">
            <b>EAGLESIGHT DETECTIVE SERVICES PRIVATE LIMITED</b>
            <span>CYBER DETECTIVES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
