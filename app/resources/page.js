import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check, Phone } from 'lucide-react';
import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';

export const metadata = {
  title: 'Cyber Help Desk',
  description: 'Where to report cybercrime in India, emergency helplines and quick safety checklists.',
};

const helplines = [
  ['1930', 'National Cyber Crime Helpline', 'Call immediately if you have lost money to online fraud. Fast reporting improves the chance of freezing funds.', 'tel:1930'],
  ['cybercrime.gov.in', 'National Cyber Crime Reporting Portal', 'File a complaint online for financial fraud, harassment, sextortion and other cybercrimes.', 'https://cybercrime.gov.in'],
  ['CERT-In', 'Indian Computer Emergency Response Team', 'Organisations must report significant cyber security incidents to CERT-In within six hours.', 'https://www.cert-in.org.in'],
  ['24/7', 'Eaglesight incident helpline', 'Need forensic help, evidence preservation or incident response? Our investigators are on call.', company.phoneHref],
];

const checklists = [
  ['If you lost money online', ['Call 1930 immediately', 'Inform your bank and block cards / UPI', 'Save screenshots, transaction IDs and phone numbers', 'File a complaint at cybercrime.gov.in']],
  ['If your account was hacked', ['Reset the password from a clean device', 'Turn on two-factor authentication', 'Log out of all other sessions', 'Warn contacts not to trust recent messages']],
  ['If you are being blackmailed', ['Do not pay or negotiate', 'Stop all contact, but do not delete the chat', 'Take screenshots of profiles and messages', 'Report it and call us for discreet help']],
  ['If your business is under attack', ['Isolate affected systems, keep them powered on', 'Do not run clean-up tools', 'Protect your backups', 'Call an incident response team']],
];

export default function ResourcesPage() {
  return (
    <>
      <PageHead eyebrow="Cyber help desk" title="Been targeted online? Start here.">
        Official reporting channels, emergency helplines and simple checklists for the first steps after a cyber incident.
      </PageHead>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Report & get help</span>
            <h2>Important helplines</h2>
          </div>
          <div className="grid-4">
            {helplines.map(([num, title, text, href]) => {
              const external = href.startsWith('http');
              return (
                <a key={title} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="card help-card reveal">
                  <span className="help-num" style={num.length > 6 ? { fontSize: 26 } : undefined}>{num}</span>
                  <h3 style={{ margin: 0, fontSize: 19 }}>{title}</h3>
                  <p>{text}</p>
                  <span className="link-arrow" style={{ marginTop: 'auto' }}>{external ? 'Visit' : 'Call now'} {external ? <ArrowUpRight /> : <Phone />}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">First steps</span>
            <h2>Quick checklists</h2>
            <p>Keep calm, preserve evidence and act quickly. These steps help in the most common situations.</p>
          </div>
          <div className="grid-2">
            {checklists.map(([title, steps]) => (
              <div key={title} className="card reveal">
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <ul className="ticks">{steps.map((s) => <li key={s}><Check /> {s}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <Link href="/incident-response" className="btn btn-navy">Business incident guide <ArrowRight /></Link>
            <Link href="/insights" className="btn btn-outline">Read our guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
