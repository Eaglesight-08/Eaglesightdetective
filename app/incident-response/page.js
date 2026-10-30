import { Phone, Check, X, ArrowRight } from 'lucide-react';
import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Incident Response',
  description: '24/7 cyber incident and ransomware response. What to do in the first 15 minutes, and how Eaglesight responds.',
};

const dos = [
  'Disconnect network cables and turn off Wi-Fi on affected machines to stop the spread.',
  'Keep affected computers powered on — decryption keys may exist only in memory.',
  'Photograph ransom notes, error screens and any wallet addresses shown.',
  'Write down times, who noticed the problem and which systems are affected.',
  `Call our forensic team on ${company.phone} for live memory capture.`,
];

const donts = [
  'Shut down, restart or unplug infected servers or computers.',
  'Run antivirus clean-up tools — they overwrite valuable timestamps.',
  'Pay a ransom without proof of decryption and professional advice.',
  'Connect clean backup drives to compromised systems.',
  'Discuss the breach publicly before CERT-In reporting is coordinated.',
];

const phases = [
  ['Within 15 minutes', 'Triage & containment', 'A remote session to cut attacker communication and stop the infection spreading.'],
  ['Within 2 hours', 'Evidence capture', 'Memory and disk evidence is preserved before it is lost, including potential encryption keys.'],
  ['Within 6 hours', 'CERT-In reporting', 'We prepare the incident report required under CERT-In directions and advise on notifications.'],
  ['Within 24 hours', 'Recovery & report', 'Known decryptors are tested, clean backups verified and a Section 65B evidence report prepared.'],
];

export default function IncidentResponsePage() {
  return (
    <>
      <PageHead
        eyebrow="Incident response"
        title="Under cyber attack? We respond 24/7."
        actions={
          <>
            <a href={company.phoneHref} className="btn btn-gold"><Phone /> Call {company.phone}</a>
            <a href="#report" className="btn btn-outline">Report an incident <ArrowRight /></a>
          </>
        }
      >
        Ransomware, a data leak or money drained from an account — every minute matters. Our first responders contain the
        threat and preserve evidence that holds up in court.
      </PageHead>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">The first 15 minutes</span>
            <h2>What to do right now</h2>
            <p>The wrong action can destroy evidence and affect insurance or legal options. Follow these steps.</p>
          </div>
          <div className="dodont">
            <div className="card do reveal">
              <span className="tag">Do this</span>
              <h3>Isolate and preserve</h3>
              <ul className="ticks">{dos.map((d) => <li key={d}><Check /> {d}</li>)}</ul>
            </div>
            <div className="card dont reveal">
              <span className="tag">Avoid this</span>
              <h3>Don’t destroy evidence</h3>
              <ul className="ticks">{donts.map((d) => <li key={d}><X /> {d}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section navy">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Our response</span>
            <h2>How we handle an incident</h2>
            <p>Target response times from the moment you call.</p>
          </div>
          <div className="steps">
            {phases.map(([time, title, text], i) => (
              <div key={title} className="step reveal">
                <div className="step-num">0{i + 1}</div>
                <div style={{ color: 'var(--gold-400)', fontSize: 12, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 14 }}>{time}</div>
                <h3 style={{ marginTop: 6 }}>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section ivory" id="report" style={{ scrollMarginTop: 90 }}>
        <div className="container narrow">
          <EnquiryForm
            title="Report an incident"
            intro="For an active attack, please call us first. Use this form to share details we should know."
            topics={['Ransomware / encrypted files', 'Data breach or leak', 'Financial fraud / money drained', 'Account takeover', 'Extortion or blackmail', 'Other incident']}
            submitLabel="Send incident report"
          />
        </div>
      </section>
    </>
  );
}
