import Image from 'next/image';
import { ArrowRight, Check, Clock, BookOpen, Monitor, FileSearch, Award, Phone } from 'lucide-react';
import { company, courses, ccdModules } from '@/lib/site';
import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Cyber Academy',
  description: 'Professional cyber detective, digital forensics, VAPT and cyber law courses from Eaglesight Cyber Academy, Pollachi.',
};

const features = [
  [Monitor, 'Virtual cyber range', 'Practise on cloud-hosted lab networks: web application attacks, Active Directory and defensive monitoring.'],
  [FileSearch, 'Real-world evidence', 'Train on sanitised disk images and phone extractions using the same tools our investigators use.'],
  [Award, 'Recognised certificate', 'Graduates receive a verifiable certificate of competence on completing the lab assessments.'],
];

export default function AcademyPage() {
  return (
    <>
      <PageHead
        eyebrow="Cyber Academy"
        title="Train under working cyber investigators"
        actions={
          <>
            <a href="#apply" className="btn btn-navy">Apply for the next batch <ArrowRight /></a>
            <a href="#courses" className="btn btn-outline">See courses</a>
          </>
        }
      >
        Practical courses in digital forensics, ethical hacking and cyber law for professionals, students, advocates and
        police personnel — online or at our Pollachi campus.
      </PageHead>

      <section className="section">
        <div className="container grid-3">
          {features.map(([Icon, title, text]) => (
            <div key={title} className="card reveal">
              <span className="icon-badge"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section ivory" id="courses" style={{ scrollMarginTop: 90 }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Programmes</span>
            <h2>Courses</h2>
            <p>Weekday and weekend batches. Contact admissions for fees, dates and instalment options.</p>
          </div>
          <div className="grid-4">
            {courses.map((c) => (
              <div key={c.code} className="card course hover reveal">
                <span className="course-code">{c.code}</span>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <div className="course-meta">
                  <span><Clock /> {c.duration}</span>
                  <span><BookOpen /> {c.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="reveal">
            <span className="eyebrow">Flagship programme</span>
            <h2>Certified Cyber Detective (CCD)</h2>
            <p>
              A 12-week programme designed by practising investigators. You will learn to gather open-source intelligence,
              trace cryptocurrency, acquire evidence from computers and phones, and prepare court-admissible reports.
            </p>
            <ul className="ticks" style={{ marginTop: 24 }}>
              {ccdModules.map((m, i) => (
                <li key={m}><Check /> <span><b style={{ color: 'var(--navy-800)' }}>Module {i + 1}.</b> {m}</span></li>
              ))}
            </ul>
            <div className="hero-actions">
              <a href="#apply" className="btn btn-navy">Apply now <ArrowRight /></a>
              <a href={company.phoneHref} className="btn btn-outline"><Phone /> Admissions</a>
            </div>
          </div>
          <div className="photo-frame reveal from-right">
            <div className="photo">
              <Image src="/images/cyber_academy.jpg" alt="Students training in the Eaglesight cyber lab" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section ivory" id="apply" style={{ scrollMarginTop: 90 }}>
        <div className="container narrow">
          <EnquiryForm
            title="Apply for admission"
            intro="Share your details and the course you are interested in. Our admissions team will contact you with fees and batch dates."
            topics={courses.map((c) => `${c.title} (${c.code})`)}
            submitLabel="Send application"
          />
        </div>
      </section>
    </>
  );
}
