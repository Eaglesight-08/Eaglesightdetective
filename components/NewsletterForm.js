'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const email = new FormData(e.currentTarget).get('email');

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email: email,
          topic: 'Cyber safety newsletter subscription',
          message: `Subscriber requested cyber safety newsletter bulletins for: ${email}`,
        }),
      });
    } catch {
      // ignore
    }

    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <p className="news-done" style={{ color: 'var(--gold-400)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 10 }}>
        <Check size={16} /> Subscribed to Cyber Safety Alerts.
      </p>
    );
  }

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <label htmlFor="news-email" className="sr-only">Email address</label>
      <input id="news-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
      <button type="submit" aria-label="Subscribe" disabled={submitting}>
        <ArrowRight />
      </button>
    </form>
  );
}
