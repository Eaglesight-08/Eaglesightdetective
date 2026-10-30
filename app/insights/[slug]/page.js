import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, Phone } from 'lucide-react';
import { company } from '@/lib/site';
import { articles, formatDate } from '@/lib/content';
import PostCard from '@/components/PostCard';

// Every slug is prerendered from generateStaticParams, so a blocking route is fine.
export const instant = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { images: [a.image] } } : {};
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const related = articles.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="page-head" style={{ paddingBottom: 96 }}>
        <div className="container narrow" style={{ position: 'relative' }}>
          <div className="crumbs"><Link href="/insights"><ArrowLeft size={13} style={{ verticalAlign: '-2px' }} /> All insights</Link></div>
          <span className="eyebrow">{a.category}</span>
          <h1>{a.title}</h1>
          <p>{a.excerpt}</p>
          <div className="reading-time">
            <span><Calendar size={15} /> {formatDate(a.date)}</span>
            <span><Clock size={15} /> {a.minutes} min read</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="article-hero reveal zoom">
          <Image src={a.image} alt="" fill sizes="100vw" priority />
        </div>
      </div>

      <section className="section">
        <div className="container article-wrap">
          <article className="prose">
            {a.body.map(([type, text], i) =>
              type === 'h2' ? <h2 key={i}>{text}</h2> : <p key={i}>{text}</p>
            )}
            <div className="box">
              <h2>Need help with this?</h2>
              <p>Our investigators can advise you confidentially. Call <a href={company.phoneHref}>{company.phone}</a> or <Link href="/contact">send us a message</Link>.</p>
            </div>
          </article>
          <aside className="article-aside">
            <div className="card">
              <h4>Urgent help</h4>
              <p style={{ fontSize: 15, marginBottom: 14 }}>Active incident or fraud in progress? Call us now.</p>
              <a href={company.phoneHref} className="btn btn-gold btn-block"><Phone /> {company.phone}</a>
            </div>
            <div className="card">
              <h4>National cyber helpline</h4>
              <p style={{ fontSize: 15 }}>Lost money online? Call <b>1930</b> or report at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a>.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Keep reading</span>
            <h2>More insights</h2>
          </div>
          <div className="grid-3">
            {related.map((r) => <div key={r.slug} className="reveal"><PostCard post={r} date={formatDate(r.date)} /></div>)}
          </div>
          <div className="hero-actions"><Link href="/insights" className="btn btn-outline">All insights <ArrowRight /></Link></div>
        </div>
      </section>
    </>
  );
}
