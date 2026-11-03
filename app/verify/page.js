import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck, Award, FileCheck, Check } from 'lucide-react';
import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';
import VerificationPortal from '@/components/VerificationPortal';
import AttachedCertificates from '@/components/AttachedCertificates';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Verification Services',
  description:
    'Official Eaglesight verification portal for Membership ID cards, ISO 27001 & GMP certificates, and forensic documents.',
};

export default function VerifyPage() {
  return (
    <>
      <PageHead
        eyebrow="Verification Services"
        title="Official Verification Portal"
        actions={
          <>
            <a href="#portal" className="btn btn-navy">Verify Credentials <ArrowRight /></a>
            <a href={company.phoneHref} className="btn btn-outline"><Phone /> {company.phone}</a>
          </>
        }
      >
        Authenticate Eaglesight investigator membership ID cards, verify ISO/IEC 27001:2022 &amp; GMP certificates,
        and validate the forensic integrity of electronic documents and evidence records.
      </PageHead>

      <section className="section" id="portal" style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="container">
          <VerificationPortal />
          <div style={{ marginTop: 40 }}>
            <AttachedCertificates />
          </div>
        </div>
      </section>

      {/* Verification Pillars Info */}
      <section className="section ivory">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow center">Authentication Standards</span>
            <h2>Three tiers of trusted verification</h2>
            <p>Built for corporations, legal counsel, government agencies, and the public.</p>
          </div>

          <div className="grid-3" style={{ marginTop: 36 }}>
            <div className="card reveal">
              <span className="icon-badge sm"><ShieldCheck /></span>
              <h3 style={{ marginTop: 12 }}>1). Membership ID Verification</h3>
              <p>
                Prevent impersonation and ensure you are working with an authorised Eaglesight cyber investigator.
                Every field operative holds a verifiable ID card tied to our corporate register.
              </p>
              <ul className="ticks" style={{ marginTop: 16, fontSize: 14 }}>
                <li><Check /> Real-time active status check</li>
                <li><Check /> Cryptographic tamper-proof badge</li>
                <li><Check /> Pan-India verified mandate</li>
              </ul>
            </div>

            <div className="card reveal">
              <span className="icon-badge sm"><Award /></span>
              <h3 style={{ marginTop: 12 }}>2). Certificate Verification</h3>
              <p>
                Validate compliance registrations, including our ISO/IEC 27001:2022 ISMS certificate (No. 25-07-21158235)
                and GMP certificate (No. 25-07-21158238) by Anglia Compliance Group UK, plus Academy student diplomas.
              </p>
              <ul className="ticks" style={{ marginTop: 16, fontSize: 14 }}>
                <li><Check /> ISO 27001 &amp; GMP certification records</li>
                <li><Check /> Direct PDF certificate downloads</li>
                <li><Check /> Cyber Academy alumni authentication</li>
              </ul>
            </div>

            <div className="card reveal">
              <span className="icon-badge sm"><FileCheck /></span>
              <h3 style={{ marginTop: 12 }}>3). Documents Verification</h3>
              <p>
                Confirm the authenticity and chain of custody of forensic reports and electronic certificates under
                Section 65B of the Bharatiya Sakshya Adhiniyam, 2023 with SHA-256 hash validation.
              </p>
              <ul className="ticks" style={{ marginTop: 16, fontSize: 14 }}>
                <li><Check /> Forensic report authenticity verification</li>
                <li><Check /> Client-side SHA-256 hash calculator</li>
                <li><Check /> Court-admissible evidentiary backing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Assistance Form */}
      <section className="section" id="enquiry">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Verification Assistance</span>
            <h2>Need official verification or background confirmation?</h2>
            <p>
              If you are an employer, law enforcement authority, or advocate requiring written authentication of an
              investigator badge, certificate, or forensic report, our Legal &amp; Compliance desk will provide an official response.
            </p>
            <ul className="ticks" style={{ marginTop: 24 }}>
              <li><Check /> Fast turnaround for corporate background checks</li>
              <li><Check /> Official verification letter with digital seal</li>
              <li><Check /> Section 65B forensic examiner attestation</li>
            </ul>
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Official Registry Address: <b>{company.addressLines.join(' ')}</b><br />
                CIN: <b>{company.cin}</b> · Standard: <b>{company.iso}</b>
              </p>
            </div>
          </div>
          <div className="reveal">
            <EnquiryForm title="Request Official Verification" />
          </div>
        </div>
      </section>
    </>
  );
}

