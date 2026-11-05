'use client';

import { useState } from 'react';
import { Lock, Check, Send, ShieldCheck, Mail } from 'lucide-react';
import { company } from '@/lib/site';
import { saveSubmission } from '@/lib/submissions-store';

const defaultTopics = [
  'Digital forensics & evidence recovery',
  'Mobile phone / WhatsApp forensics',
  'Cyber security audit (VAPT)',
  'Corporate investigation / insider threat',
  'Cryptocurrency & cyber fraud tracing',
  'Bug sweeping (TSCM)',
  'Membership ID card verification',
  'Certificate & credential verification',
  'Documents & forensic report verification',
  'ISO/IEC 27001 or DPDP compliance',
  'Cyber Academy admission',
];

export default function EnquiryForm({
  title = 'Request a confidential consultation',
  intro = 'Tell us briefly what happened. A senior investigator will get back to you.',
  topics = defaultTopics,
  defaultTopic,
  submitLabel = 'Send enquiry',
}) {
  const [submission, setSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    const data = {
      name: f.get('name'),
      phone: f.get('phone'),
      email: f.get('email'),
      topic: f.get('topic'),
      message: f.get('message'),
    };

    let item = null;
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        item = json.item || { id: json.id, ...data };
      }
    } catch (err) {
      console.warn('API submission fallback:', err);
    }

    if (!item) {
      item = saveSubmission(data);
    }

    setSubmission(item);
    setSubmitting(false);
  };

  if (submission) {
    return (
      <div className="form-card">
        <div className="form-success">
          <span className="icon-badge"><Check /></span>
          <h3>Enquiry Successfully Received</h3>
          <div style={{ margin: '14px 0', padding: '10px 16px', background: 'var(--ivory)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block' }}>Reference Case Number:</span>
            <code style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold-600)' }}>{submission.id}</code>
          </div>
          <p>
            Your inquiry has been logged securely into our investigation registry. A senior investigator will review your case and respond within our target response window.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`mailto:${company.email}`} className="btn btn-navy btn-sm"><Mail size={14} /> Email Helpline</a>
            <button className="btn btn-outline btn-sm" onClick={() => setSubmission(null)}>Submit another inquiry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit} name="enquiries" data-netlify="true">
      <input type="hidden" name="form-name" value="enquiries" />
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
      <button type="submit" className="btn btn-navy btn-block" disabled={submitting}>
        <Send /> {submitting ? 'Submitting...' : submitLabel}
      </button>
      <div className="form-note"><Lock /> Every enquiry is handled in strict confidence.</div>
    </form>
  );
}
