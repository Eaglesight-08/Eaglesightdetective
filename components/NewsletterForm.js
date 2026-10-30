'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { company } from '@/lib/site';

// Subscribes by opening a pre-filled email to the company inbox.
export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    const body = `Please add ${email} to the Eaglesight cyber safety newsletter.`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent('Newsletter subscription')}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  if (done) {
    return <p className="news-done"><Check /> Your email app opened — press send to confirm.</p>;
  }

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <label htmlFor="news-email" className="sr-only">Email address</label>
      <input id="news-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
      <button type="submit" aria-label="Subscribe"><ArrowRight /></button>
    </form>
  );
}
