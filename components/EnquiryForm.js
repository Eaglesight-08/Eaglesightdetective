'use client';

import { useState } from 'react';
import { Lock, Check, Send } from 'lucide-react';
import { company } from '@/lib/site';

const defaultTopics = [
  'Digital forensics & evidence recovery',
  'Mobile phone / WhatsApp forensics',
  'Cyber security audit (VAPT)',
  'Corporate investigation / insider threat',
  'Cryptocurrency & cyber fraud tracing',
  'Bug sweeping (TSCM)',
  'ISO/IEC 27032 or DPDP compliance',
  'Cyber Academy admission',
];

// Sends the enquiry through the visitor's own email app, addressed to the company inbox.
export default function EnquiryForm({
  title = 'Request a confidential consultation',
  intro = 'Tell us briefly what happened. A senior investigator will get back to you.',
  topics = defaultTopics,
  defaultTopic,
  submitLabel = 'Send enquiry',
}) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Website enquiry: ${f.get('topic')}`;
    const body = [
      `Name: ${f.get('name')}`,
      `Phone: ${f.get('phone')}`,
      `Email: ${f.get('email')}`,
      `Topic: ${f.get('topic')}`,
      '',
      f.get('message'),
    ].join('\n');
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-card">
        <div className="form-success">
          <span className="icon-badge"><Check /></span>
          <h3>Your email is ready to send</h3>
          <p>
            We opened your email app with the details filled in — just press send. If nothing opened, write to{' '}
            <a href={`mailto:${company.email}`} className="link-arrow">{company.email}</a> or call{' '}
            <a href={company.phoneHref} className="link-arrow">{company.phone}</a>.
          </p>
          <button className="btn btn-outline" onClick={() => setSent(false)}>Back to the form</button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h3>{title}</h3>
      <p>{intro}</p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="ef-name">Full name</label>
          <input id="ef-name" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="ef-phone">Phone</label>
          <input id="ef-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ef-email">Email</label>
        <input id="ef-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="ef-topic">How can we help?</label>
        <select id="ef-topic" name="topic" defaultValue={defaultTopic ?? topics[0]}>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="ef-message">Brief description</label>
        <textarea id="ef-message" name="message" required placeholder="What happened, when, and what you need from us." />
      </div>
      <button type="submit" className="btn btn-navy btn-block"><Send /> {submitLabel}</button>
      <div className="form-note"><Lock /> Every enquiry is handled in strict confidence.</div>
    </form>
  );
}
