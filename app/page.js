import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, BadgeCheck, MapPin, Clock, Scale, BookOpen, ShieldCheck, Plus } from 'lucide-react';
import { company, pillars, services, workflow, courses } from '@/lib/site';
import { stats, capabilities, industries, articles, faqs, formatDate } from '@/lib/content';
import ServiceIcon from '@/components/ServiceIcon';
import ServicesExplorer from '@/components/ServicesExplorer';
import Seal3D from '@/components/Seal3D';
import PostCard from '@/components/PostCard';

const heroWords = [
  ['Skilled'], ['detectives'], ['for'], ['a'], ['safer', true], ['digital', true], ['world.', true],
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <Image src="/images/eagle_mark.png" alt="" width={600} height={380} className="hero-watermark" aria-hidden="true" priority />
        <div className="container hero-grid">
          <div className="hero-in">
            <span className="eyebrow">Cyber Detectives · {company.iso}</span>
            <h1 aria-label="Skilled detectives for a safer digital world.">
              {heroWords.map(([w, gold], i) => {
                const word = <span className="word" style={{ '--i': i }} aria-hidden="true">{w}</span>;
                return <span key={i}>{gold ? <em>{word}</em> : word}{' '}</span>;
              })}
            </h1>
            <p className="hero-lead">
              Eaglesight Detective Services is a cyber investigation firm in Pollachi, Coimbatore. We protect businesses,
              recover digital evidence that stands up in court, and train the next generation of cyber investigators.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-navy" data-magnetic>Book a consultation <ArrowRight /></Link>
              <a href={company.phoneHref} className="btn btn-outline" data-magnetic><Phone /> 24/7 helpline</a>
            </div>
            <div className="hero-meta">
              <span><BadgeCheck /> {company.iso} certified</span>
              <span><Scale /> Section 65B court-ready reports</span>
              <span><MapPin /> Pollachi, Tamil Nadu</span>
            </div>
          </div>

          <div className="hero-visual">
            <Seal3D />
            <div className="hero-chip c1"><span className="live-dot" /> <span>24/7 response desk<small>Investigators on call</small></span></div>
            <div className="hero-chip c2"><ShieldCheck /> <span>{company.iso}<small>Certified practice</small></span></div>
            <div className="hero-chip c3"><Scale /> <span>Court-ready evidence<small>Section 65B certified</small></span></div>
          </div>
        </div>
        <span className="scroll-cue" aria-hidden="true" />
      </section>

      {/* Letterhead service strip */}
      <div className="strip">
        <div className="container">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.id}`} className="strip-item">
              <ServiceIcon name={s.icon} /> {s.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="stats-band spotlight">
        <div className="container">
          {stats.map((s) => (
            <div key={s.label} className="stat reveal">
              <div className="stat-num" style={{ '--to': s.value }}>
                {s.prefix}<span className="stat-val" data-count={s.value}>{s.value}</span>{s.suffix}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services explorer */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">What we do</span>
            <h2>Four practices, one standard of care</h2>
            <p>From hardening your systems to proving what happened in court, every engagement is run by experienced investigators under a strict NDA.</p>
          </div>
          <div className="reveal"><ServicesExplorer /></div>
        </div>
      </section>

      {/* Capability marquee */}
      <div className="marquee" aria-label="Capabilities">
        <div className="marquee-track">
          {[...capabilities, ...capabilities].map((c, i) => (
            <span key={i} className="marquee-item" aria-hidden={i >= capabilities.length}>{c}</span>
          ))}
        </div>
      </div>

      {/* Lab */}
      <section className="section ivory">
        <div className="container split">
          <div className="photo-frame reveal from-left">
            <div className="photo" data-parallax="-0.04">
              <Image src="/images/forensics_lab.jpg" alt="Investigators analysing evidence in the Eaglesight forensic lab" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
          <div className="reveal from-right">
            <span className="eyebrow">Our laboratory</span>
            <h2>Evidence handled the right way, from the first minute</h2>
            <p>
              Our Pollachi forensic lab uses hardware write-blockers, signal-isolation enclosures and validated tools so original
              evidence is never altered. Every item is logged, hashed and tracked through a documented chain of custody.
            </p>
            <p>
              The result is a clear report your lawyers, management or the police can rely on — prepared under Section 65B of
              the Bharatiya Sakshya Adhiniyam, 2023.
            </p>
            <div className="hero-actions">
              <Link href="/services/digital-forensics" className="btn btn-navy" data-magnetic>Digital forensics <ArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section navy spotlight">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">How we work</span>
            <h2>A forensic process built for the courtroom</h2>
            <p>Aligned with ISO/IEC 27032 guidance and Indian evidence law, so findings hold up under scrutiny.</p>
          </div>
          <div className="steps">
            {workflow.map(([title, text], i) => (
              <div key={title} className="step reveal">
                <div className="step-num">0{i + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section">
        <div className="container">
          <div className="split" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="section-head reveal" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Industries</span>
              <h2>Protecting organisations — and the people in them</h2>
            </div>
            <div className="reveal" style={{ justifySelf: 'end' }}>
              <Link href="/industries" className="btn btn-outline">All industries <ArrowRight /></Link>
            </div>
          </div>
          <div className="grid-4">
            {industries.map((ind) => (
              <Link key={ind.id} href={`/industries#${ind.id}`} className="card industry reveal">
                <span className="icon-badge sm"><ServiceIcon name={ind.icon} /></span>
                <h3>{ind.title}</h3>
                <p>{ind.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Academy */}
      <section className="section ivory">
        <div className="container">
          <div className="split" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="section-head reveal" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Eaglesight Cyber Academy</span>
              <h2>Learn investigation from working investigators</h2>
              <p>Practical, lab-based courses for professionals, students, advocates and police personnel — online or at our Pollachi campus.</p>
            </div>
            <div className="reveal" style={{ justifySelf: 'end' }}>
              <Link href="/academy" className="btn btn-outline">View all courses <ArrowRight /></Link>
            </div>
          </div>
          <div className="grid-4">
            {courses.map((c) => (
              <Link key={c.code} href="/academy#courses" className="card course reveal">
                <span className="course-code">{c.code}</span>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <div className="course-meta">
                  <span><Clock /> {c.duration}</span>
                  <span><BookOpen /> {c.level}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="section">
        <div className="container">
          <div className="split" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="section-head reveal" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Insights</span>
              <h2>Guides & alerts from our investigators</h2>
            </div>
            <div className="reveal" style={{ justifySelf: 'end' }}>
              <Link href="/insights" className="btn btn-outline">All insights <ArrowRight /></Link>
            </div>
          </div>
          <div className="grid-3">
            {articles.slice(0, 3).map((a) => (
              <div key={a.slug} className="reveal"><PostCard post={a} date={formatDate(a.date)} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section ivory">
        <div className="container seal-show">
          <div className="seal-card reveal zoom">
            <div className="seal-wrap">
              <span className="seal-glow" />
              <span className="seal-ring" />
              <span className="seal-ring inner" />
              <Image src="/images/eagle_logo_clean.png" alt="Eaglesight Detective Services seal" width={210} height={208} />
            </div>
            <div className="seal-title">Eaglesight Detective Services<br />Private Limited</div>
            <div className="seal-sub">CYBER DETECTIVES</div>
            <div className="seal-pillars">
              {pillars.map((p) => <span key={p}>{p}</span>)}
            </div>
          </div>
          <div className="reveal from-right">
            <span className="eyebrow">Verified company</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', margin: '14px 0 16px' }}>Registered, certified and accountable</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 28 }}>
              Eaglesight Detective Services Private Limited is incorporated with the Ministry of Corporate Affairs, Government of India.
            </p>
            <dl className="facts" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="fact"><dt>Corporate CIN</dt><dd style={{ fontSize: 16 }}>{company.cin}</dd></div>
              <div className="fact"><dt>Standard</dt><dd style={{ fontSize: 16 }}>{company.iso}</dd></div>
              <div className="fact" style={{ borderLeft: 0, borderTop: '1px solid var(--line)' }}><dt>Registered in</dt><dd style={{ fontSize: 16 }}>Tamil Nadu, India</dd></div>
              <div className="fact" style={{ borderTop: '1px solid var(--line)' }}><dt>Motto</dt><dd style={{ fontSize: 16 }}>Skilled detectives for a safer digital world</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="section-head reveal">
            <span className="eyebrow">Questions</span>
            <h2>Frequently asked</h2>
            <p>Straight answers about confidentiality, evidence and how we work.</p>
            <div className="hero-actions"><Link href="/faq" className="btn btn-outline">All questions <ArrowRight /></Link></div>
          </div>
          <div className="faq-list reveal">
            {faqs.slice(0, 4).map(([q, a]) => (
              <details key={q} className="faq">
                <summary>{q}<span className="faq-icon"><Plus /></span></summary>
                <div className="faq-body">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
