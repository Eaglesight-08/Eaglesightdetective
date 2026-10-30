import Link from 'next/link';
import { Plus, ArrowRight, Phone } from 'lucide-react';
import { company } from '@/lib/site';
import { faqs } from '@/lib/content';
import PageHead from '@/components/PageHead';

export const metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about confidentiality, evidence, costs and how Eaglesight works.',
};

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead eyebrow="FAQ" title="Frequently asked questions">
        Straight answers about confidentiality, evidence, costs and how we work. Can’t find yours? Ask us directly.
      </PageHead>

      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <details key={q} className="faq reveal" open={i === 0}>
                <summary>{q}<span className="faq-icon"><Plus /></span></summary>
                <div className="faq-body">{a}</div>
              </details>
            ))}
          </div>
          <aside className="reveal" style={{ position: 'sticky', top: 120 }}>
            <div className="card">
              <span className="eyebrow">Still have questions?</span>
              <h3>Talk to an investigator</h3>
              <p>Confidential, no-obligation consultation by phone or email.</p>
              <div className="hero-actions" style={{ marginTop: 22 }}>
                <Link href="/contact" className="btn btn-navy">Contact us <ArrowRight /></Link>
                <a href={company.phoneHref} className="btn btn-outline"><Phone /> Call</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
