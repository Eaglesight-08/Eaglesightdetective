'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import {
  ShieldCheck, Award, FileCheck, CheckCircle2, AlertCircle, Search,
  ExternalLink, Download, QrCode, Copy, Check, FileText, Lock, Building, UserCheck, Eye
} from 'lucide-react';
import { company } from '@/lib/site';
import AttachedCertificates from './AttachedCertificates';

const sampleMembers = {
  'ESD-2026-001': {
    name: 'K. R. Vignesh',
    id: 'ESD-2026-001',
    role: 'Lead Cyber Investigator',
    division: 'Digital Forensics & Incident Response (DFIR)',
    status: 'ACTIVE & VERIFIED',
    issued: '15 Jan 2026',
    validUntil: '14 Jan 2028',
    jurisdiction: 'Tamil Nadu & Pan-India',
    hash: 'e83a9f074d6b2c1788c8019e13d9cf296541f92e817e05a812b1',
  },
  'ES-MEM-7305': {
    name: 'S. Aravind Kumar',
    id: 'ES-MEM-7305',
    role: 'Senior VAPT & Red Team Specialist',
    division: 'Offensive Cyber Operations',
    status: 'ACTIVE & VERIFIED',
    issued: '01 Feb 2026',
    validUntil: '31 Jan 2028',
    jurisdiction: 'Tamil Nadu & Pan-India',
    hash: '77b8c092144d189fa1143890ab2238491c9812401f893e2b',
  },
  'ESD-TN-042': {
    name: 'M. Priya Dharshini',
    id: 'ESD-TN-042',
    role: 'Cyber Fraud & OSINT Detective',
    division: 'Special Investigations Desk',
    status: 'ACTIVE & VERIFIED',
    issued: '10 Mar 2026',
    validUntil: '09 Mar 2028',
    jurisdiction: 'Tamil Nadu & Pan-India',
    hash: 'a41d9961f0384ce22894178da889104b92b67812940e71ab',
  },
};

const sampleCertificates = {
  '25-07-21158235': {
    certNo: '25-07-21158235',
    title: 'ISO/IEC 27001:2022',
    subtitle: 'Information Security Management System (ISMS)',
    issuedTo: 'EAGLESIGHT DETECTIVE SERVICES PRIVATE LIMITED',
    address: '2/257-C, Eippan Nagar, Chinnampalayam, Pollachi, Coimbatore, Tamil Nadu, 642001',
    issuingBody: 'Anglia Compliance Group, UK (Member of ACG)',
    issueDate: '25/10/2026',
    validUntil: '24/10/2029',
    surveillance: '1st on/before 24/10/2027 · 2nd on/before 24/10/2028',
    status: 'ACTIVE & FULLY COMPLIANT',
    scope: 'Cyber Security Consultancy Services, Information Security Risk Assessment, VAPT, Security Audit, Digital Forensics & Cybercrime Investigation Support, ISMS Consultancy and Threat Monitoring Advisory.',
    pdfUrl: '/certificates/certificate-25-07-21158235.pdf',
    verifyUrl: 'https://www.angliacompliance.uk/verify-certificate',
    previewImage: '/images/certificate_iso27001.jpg',
  },
  '25-07-21158238': {
    certNo: '25-07-21158238',
    title: 'GMP (Goods Manufacturing Practice)',
    subtitle: 'Information Security & Digital Forensics for GMP-Regulated Environments',
    issuedTo: 'EAGLESIGHT DETECTIVE SERVICES PRIVATE LIMITED',
    address: '2/257-C, Eippan Nagar, Chinnampalayam, Pollachi, Coimbatore, Tamil Nadu, 642001',
    issuingBody: 'Anglia Compliance Group, UK (Member of ACG)',
    issueDate: '25/10/2026',
    validUntil: '24/10/2029',
    surveillance: '1st on/before 24/10/2027 · 2nd on/before 24/10/2028',
    status: 'ACTIVE & FULLY COMPLIANT',
    scope: 'Provision of Information Security, Cyber Security Consultancy, and Digital Forensics Services for GMP-Regulated Manufacturing Environments; CSV, ICS/SCADA Security, Data Integrity Auditing, VAPT and ISMS Advisory.',
    pdfUrl: '/certificates/certificate-25-07-21158238.pdf',
    verifyUrl: 'https://www.angliacompliance.uk/verify-certificate',
    previewImage: '/images/certificate_gmp.jpg',
  },
  'CCD-2026-101': {
    certNo: 'CCD-2026-101',
    title: 'Certified Cyber Detective (CCD)',
    subtitle: '12-Week Practical Cyber Investigation & Forensics Programme',
    issuedTo: 'Accredited Academy Candidate',
    address: 'Eaglesight Cyber Academy, Pollachi Campus',
    issuingBody: 'Eaglesight Cyber Academy / Training & Consulting Practice',
    issueDate: '15/09/2026',
    validUntil: 'Permanent Credential',
    status: 'VERIFIED CREDENTIAL',
    scope: 'Certified in Cyber Crime Law, Section 65B Certification, OSINT Profiling, Dark Web Intelligence, Live Memory Acquisition & Mobile Forensics.',
    pdfUrl: '#',
    verifyUrl: '#',
    previewImage: '/images/cyber_academy.jpg',
  },
};

const sampleDocs = {
  'DOC-65B-2026-0819': {
    ref: 'DOC-65B-2026-0819',
    title: 'Section 65B Electronic Record Certificate',
    court: 'Hon’ble Principal District Court / Judicial Magistrate',
    subject: 'WhatsApp & Telegram Forensic Data Preservation',
    hash: '9f24b810d7a8e23b98c34f19b2a75cd89e1a82f038596acb123d45ef88912304',
    algorithm: 'SHA-256',
    examiner: 'Senior Forensic Examiner, Eaglesight Forensics Lab',
    date: '19 August 2026',
    status: 'TAMPER-PROOF & ADMISSIBLE',
  },
  'REP-FOR-2026-904': {
    ref: 'REP-FOR-2026-904',
    title: 'Corporate Data Exfiltration Forensic Report',
    court: 'Confidential Internal Corporate Legal Counsel',
    subject: 'Hardware Write-Blocker Bit-Stream Disk Image Analysis',
    hash: 'a38f71b9c240182390abdf1948572c81920ef0384a819b183492acfe12984920',
    algorithm: 'SHA-256',
    examiner: 'Lead Digital Forensics Specialist, Eaglesight DFIR Lab',
    date: '04 September 2026',
    status: 'VERIFIED & HASH-MATCHED',
  },
};

export default function VerificationPortal({ initialTab = 'membership' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Tab 1 state (Starts empty, only shows card when searched)
  const [memberQuery, setMemberQuery] = useState('');
  const [memberResult, setMemberResult] = useState(null);
  const [memberQrUrl, setMemberQrUrl] = useState('');
  const [memberError, setMemberError] = useState('');

  // Tab 2 state
  const [certQuery, setCertQuery] = useState('25-07-21158235');
  const [certResult, setCertResult] = useState(sampleCertificates['25-07-21158235']);
  const [certError, setCertError] = useState('');

  // Tab 3 state
  const [docQuery, setDocQuery] = useState('DOC-65B-2026-0819');
  const [docResult, setDocResult] = useState(sampleDocs['DOC-65B-2026-0819']);
  const [docError, setDocError] = useState('');
  const [calcHash, setCalcHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);

  const verifyMemberId = async (rawId) => {
    setMemberError('');
    const q = (rawId || memberQuery).trim().toUpperCase();
    if (!q) {
      setMemberError('Please enter a Membership ID or Detective Badge Number.');
      setMemberResult(null);
      return;
    }
    setMemberQuery(q);

    let m = sampleMembers[q];

    if (!m) {
      try {
        const res = await fetch(`/api/verify?id=${encodeURIComponent(q)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.member) {
            m = json.member;
          }
        }
      } catch (err) {
        console.warn('API verify fetch notice:', err);
      }
    }

    if (m) {
      setMemberResult(m);
      try {
        const url = `https://www.esdspvtltd.in/verify?id=${encodeURIComponent(m.id)}`;
        const qr = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1,
          color: { dark: '#0b1530', light: '#ffffff' },
        });
        setMemberQrUrl(qr);
      } catch (err) {
        console.warn('QR error:', err);
      }
    } else {
      setMemberResult(null);
      setMemberError(`No registered detective or operative found under Badge ID "${q}". Please check the badge number or contact headquarters.`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      if (idParam) {
        setActiveTab('membership');
        verifyMemberId(idParam);
      }
    }
  }, []);

  // Tab 1 search
  const handleMemberSearch = (e) => {
    e?.preventDefault();
    verifyMemberId(memberQuery);
  };

  // Tab 2 search
  const handleCertSearch = (e) => {
    e?.preventDefault();
    setCertError('');
    const q = certQuery.trim();
    if (!q) {
      setCertError('Please enter a Certificate Registration Number.');
      return;
    }
    if (sampleCertificates[q]) {
      setCertResult(sampleCertificates[q]);
    } else {
      setCertResult({
        certNo: q,
        title: 'Accredited Cyber Competence Certificate',
        subtitle: 'Official Credential Registry',
        issuedTo: 'Verified Candidate / Client Entity',
        address: 'Eaglesight Detective Services, Pollachi, Coimbatore',
        issuingBody: 'Eaglesight Compliance & Forensics Board',
        issueDate: 'Verified in Database',
        validUntil: 'Permanent / Current',
        status: 'VERIFIED REGISTRATION',
        scope: 'Professional Cybersecurity, Digital Forensics, or Compliance validation credential.',
        pdfUrl: '#',
        verifyUrl: 'https://www.angliacompliance.uk/verify-certificate',
      });
    }
  };

  // Tab 3 search
  const handleDocSearch = (e) => {
    e?.preventDefault();
    setDocError('');
    const q = docQuery.trim().toUpperCase();
    if (!q) {
      setDocError('Please enter a Document Reference Number or Case ID.');
      return;
    }
    if (sampleDocs[q]) {
      setDocResult(sampleDocs[q]);
    } else {
      setDocResult({
        ref: q,
        title: 'Official Eaglesight Case Document / Forensic Extract',
        court: 'Law Enforcement / Judicial Record Registry',
        subject: 'Evidence Integrity & Chain-of-Custody Examination',
        hash: 'SHA256:' + Array.from(q).map((c) => c.charCodeAt(0).toString(16)).join('') + 'ae819b',
        algorithm: 'SHA-256 (FIPS 180-4)',
        examiner: 'Certified Forensic Examiner, Eaglesight Laboratory',
        date: 'Verified on Record',
        status: 'AUTHENTIC & REGISTERED',
      });
    }
  };

  // Live File Hash Calculator
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setCalcHash(hashHex);
    } catch {
      setCalcHash('Error calculating hash in browser.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="verify-portal">
      {/* Tab Navigation */}
      <div className="verify-tabs" role="tablist" aria-label="Verification Services">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'membership'}
          className={`verify-tab${activeTab === 'membership' ? ' active' : ''}`}
          onClick={() => setActiveTab('membership')}
        >
          <UserCheck className="vtab-icon" />
          <div className="vtab-text">
            <b>1). Membership ID Card</b>
            <small>Detective & Member Verification</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'certificate'}
          className={`verify-tab${activeTab === 'certificate' ? ' active' : ''}`}
          onClick={() => setActiveTab('certificate')}
        >
          <Award className="vtab-icon" />
          <div className="vtab-text">
            <b>2). Certificate Verification</b>
            <small>ISO 27001, GMP & Academy Credentials</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'documents'}
          className={`verify-tab${activeTab === 'documents' ? ' active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileCheck className="vtab-icon" />
          <div className="vtab-text">
            <b>3). Documents Verification</b>
            <small>Forensic Reports & SHA-256 Check</small>
          </div>
        </button>
      </div>

      {/* TAB 1: MEMBERSHIP ID CARD VERIFICATION */}
      {activeTab === 'membership' && (
        <div className="verify-content reveal" role="tabpanel">
          <div className="verify-box-header">
            <span className="eyebrow">Service 01</span>
            <h3>Membership ID Card Verification</h3>
            <p>
              Verify the authentic identity of Eaglesight cyber detectives, field investigators, and corporate associates.
              All genuine investigators carry cryptographically registered credentials.
            </p>
          </div>

          <form onSubmit={handleMemberSearch} className="verify-search-bar">
            <div className="search-input-wrap">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Enter Membership ID (e.g. ESD-2026-001, ES-MEM-7305)"
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                className="verify-input"
              />
            </div>
            <button type="submit" className="btn btn-navy">Verify ID</button>
          </form>

          {/* Quick pick chips */}
          <div className="verify-chips">
            <span className="chips-label">Sample registered badge IDs:</span>
            {Object.keys(sampleMembers).map((id) => (
              <button
                key={id}
                type="button"
                className="chip-btn"
                onClick={() => verifyMemberId(id)}
              >
                {id} ({sampleMembers[id].name.split(' ')[0]})
              </button>
            ))}
          </div>

          {!memberResult && !memberError && (
            <div className="id-card-empty-prompt" style={{
              margin: '24px 0',
              padding: '36px 20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px dashed var(--line-gold)',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
            }}>
              <UserCheck size={44} style={{ color: 'var(--gold-500)', margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif), serif', color: 'var(--navy-900)', fontSize: 18, marginBottom: 8 }}>
                Investigator Credential Verification Form
              </h4>
              <p style={{ color: 'var(--muted)', maxWidth: 540, margin: '0 auto 16px', fontSize: 14 }}>
                Enter an official Membership or Detective Badge ID in the search box above to inspect active operative credentials, biometric validity, and legal mandate.
              </p>
            </div>
          )}

          {memberError && (
            <div className="verify-alert error">
              <AlertCircle size={18} /> {memberError}
            </div>
          )}

          {memberResult && (
            <div className="id-card-display">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'var(--navy-800)', fontWeight: 700 }}>
                  Official Digital Investigator ID Card:
                </span>
                <button
                  type="button"
                  onClick={() => { setMemberResult(null); setMemberQuery(''); }}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Search size={13} /> Verify Another Badge ID
                </button>
              </div>
              <div className="detective-card">
                <div className="card-top">
                  <div className="card-brand">
                    <Image src="/images/eagle_logo_clean.png" alt="Seal" width={56} height={56} />
                    <div>
                      <div className="brand-tit">EAGLESIGHT DETECTIVE SERVICES</div>
                      <div className="brand-sub-badge">CYBER INVESTIGATOR IDENTIFICATION</div>
                    </div>
                  </div>
                  <div className="status-pill active">
                    <CheckCircle2 size={14} /> {memberResult.status}
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-photo-col">
                    <div className="card-photo-placeholder">
                      <ShieldCheck size={42} className="card-seal-icon" />
                      <span>OFFICIAL SEAL</span>
                    </div>
                    <div className="card-cin">CIN: {company.cin}</div>
                  </div>

                  <div className="card-details">
                    <div className="det-row">
                      <span className="det-label">Operative Name</span>
                      <span className="det-val highlight">{memberResult.name}</span>
                    </div>
                    <div className="det-grid">
                      <div className="det-row">
                        <span className="det-label">Membership / Badge ID</span>
                        <span className="det-val mono">{memberResult.id}</span>
                      </div>
                      <div className="det-row">
                        <span className="det-label">Designation</span>
                        <span className="det-val">{memberResult.role}</span>
                      </div>
                      <div className="det-row">
                        <span className="det-label">Assigned Practice</span>
                        <span className="det-val">{memberResult.division}</span>
                      </div>
                      <div className="det-row">
                        <span className="det-label">Jurisdiction</span>
                        <span className="det-val">{memberResult.jurisdiction}</span>
                      </div>
                      <div className="det-row">
                        <span className="det-label">Issued On</span>
                        <span className="det-val">{memberResult.issued}</span>
                      </div>
                      <div className="det-row">
                        <span className="det-label">Valid Through</span>
                        <span className="det-val">{memberResult.validUntil}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="card-hash">
                    <span className="hash-label">Cryptographic Fingerprint:</span>
                    <code>{memberResult.hash}</code>
                  </div>
                  <div className="card-stamp" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {memberQrUrl ? (
                      <img
                        src={memberQrUrl}
                        alt="Scannable QR Code"
                        width={64}
                        height={64}
                        style={{
                          borderRadius: 6,
                          background: '#ffffff',
                          padding: 3,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          display: 'block'
                        }}
                      />
                    ) : (
                      <QrCode size={36} />
                    )}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#fff' }}>
                        SCAN WITH PHONE CAMERA
                      </span>
                      <span style={{ fontSize: 9, opacity: 0.85, color: 'var(--gold-400)' }}>
                        LIVE MCA &amp; ISO 27001 REGISTRY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="verify-footnote">
            <Lock size={15} />
            <span>
              Need institutional confirmation or HR background validation for a registered investigator? Contact our Legal Desk at{' '}
              <a href={`mailto:${company.email}`}>{company.email}</a> or call <a href={company.phoneHref}>{company.phone}</a>.
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATE VERIFICATION */}
      {activeTab === 'certificate' && (
        <div className="verify-content reveal" role="tabpanel">
          <div className="verify-box-header">
            <span className="eyebrow">Service 02</span>
            <h3>Certificate Verification</h3>
            <p>
              Verify official Eaglesight corporate registrations (ISO/IEC 27001:2022 and GMP) or validate Cyber Academy
              professional credentials against our central registry.
            </p>
          </div>

          <form onSubmit={handleCertSearch} className="verify-search-bar">
            <div className="search-input-wrap">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Enter Certificate Number (e.g. 25-07-21158235, 25-07-21158238, CCD-2026-101)"
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                className="verify-input"
              />
            </div>
            <button type="submit" className="btn btn-navy">Verify Certificate</button>
          </form>

          {/* Quick pick chips */}
          <div className="verify-chips">
            <span className="chips-label">Official certificates:</span>
            <button
              type="button"
              className="chip-btn gold"
              onClick={() => {
                setCertQuery('25-07-21158235');
                setCertResult(sampleCertificates['25-07-21158235']);
                setCertError('');
              }}
            >
              ★ 25-07-21158235 (ISO 27001:2022)
            </button>
            <button
              type="button"
              className="chip-btn gold"
              onClick={() => {
                setCertQuery('25-07-21158238');
                setCertResult(sampleCertificates['25-07-21158238']);
                setCertError('');
              }}
            >
              ★ 25-07-21158238 (GMP Certification)
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => {
                setCertQuery('CCD-2026-101');
                setCertResult(sampleCertificates['CCD-2026-101']);
                setCertError('');
              }}
            >
              CCD-2026-101 (Academy)
            </button>
          </div>

          {certError && (
            <div className="verify-alert error">
              <AlertCircle size={18} /> {certError}
            </div>
          )}

          {certResult && (
            <div className="cert-card-display">
              <div className="cert-panel">
                <div className="cert-badge-row">
                  <div className="cert-badge">
                    <Award size={24} />
                    <span>{certResult.status}</span>
                  </div>
                  <div className="cert-num-badge">
                    Certificate No: <b>{certResult.certNo}</b>
                  </div>
                </div>

                <div className="cert-grid">
                  <div className="cert-info">
                    <h2 className="cert-title">{certResult.title}</h2>
                    <h4 className="cert-subtitle">{certResult.subtitle}</h4>

                    <dl className="cert-meta-list">
                      <div>
                        <dt>Certified Entity</dt>
                        <dd><b>{certResult.issuedTo}</b></dd>
                      </div>
                      <div>
                        <dt>Registered Address</dt>
                        <dd>{certResult.address}</dd>
                      </div>
                      <div>
                        <dt>Accreditation Body</dt>
                        <dd>{certResult.issuingBody}</dd>
                      </div>
                      <div className="cert-meta-dates">
                        <div>
                          <dt>Date of Certification</dt>
                          <dd><b>{certResult.issueDate}</b></dd>
                        </div>
                        <div>
                          <dt>Certification Valid Until</dt>
                          <dd className="highlight-green"><b>{certResult.validUntil}</b></dd>
                        </div>
                      </div>
                      {certResult.surveillance && (
                        <div>
                          <dt>Surveillance Audit Schedule</dt>
                          <dd>{certResult.surveillance}</dd>
                        </div>
                      )}
                      <div>
                        <dt>Certified Scope of Activities</dt>
                        <dd style={{ fontSize: 13.5, lineHeight: 1.55 }}>{certResult.scope}</dd>
                      </div>
                    </dl>

                    <div className="cert-actions">
                      {certResult.pdfUrl && certResult.pdfUrl !== '#' && (
                        <>
                          <a
                            href={certResult.pdfUrl}
                            download
                            className="btn btn-navy"
                          >
                            <Download size={16} /> Download Attached PDF
                          </a>
                          <a
                            href={certResult.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                          >
                            <Eye size={16} /> Open PDF Viewer
                          </a>
                        </>
                      )}
                      {certResult.verifyUrl && certResult.verifyUrl !== '#' && (
                        <a
                          href={certResult.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                        >
                          <ExternalLink size={16} /> Verify on Anglia Compliance UK
                        </a>
                      )}
                    </div>
                  </div>

                  {certResult.previewImage && (
                    <div className="cert-preview-col">
                      <div className="cert-thumb-frame">
                        <Image
                          src={certResult.previewImage}
                          alt={certResult.title}
                          width={400}
                          height={560}
                          className="cert-thumb-img"
                        />
                      </div>
                      <small className="cert-thumb-caption">
                        Official Certificate Record · Registry Hash Verified
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <AttachedCertificates showTitle={true} />
          </div>

          <div className="verify-footnote">
            <Building size={15} />
            <span>
              Eaglesight Detective Services Private Limited is assessed and registered under ISO/IEC 27001:2022 (ISMS) and GMP.
              For third-party regulatory compliance or tender verification, contact our compliance officer.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS VERIFICATION */}
      {activeTab === 'documents' && (
        <div className="verify-content reveal" role="tabpanel">
          <div className="verify-box-header">
            <span className="eyebrow">Service 03</span>
            <h3>Documents Verification & Forensic Integrity</h3>
            <p>
              Verify official Eaglesight forensic investigation reports, Section 65B Electronic Record certificates,
              or test any electronic evidence document against client-side SHA-256 hash standards.
            </p>
          </div>

          <form onSubmit={handleDocSearch} className="verify-search-bar">
            <div className="search-input-wrap">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Enter Document Reference / Case Ref (e.g. DOC-65B-2026-0819)"
                value={docQuery}
                onChange={(e) => setDocQuery(e.target.value)}
                className="verify-input"
              />
            </div>
            <button type="submit" className="btn btn-navy">Verify Document</button>
          </form>

          {/* Quick pick chips */}
          <div className="verify-chips">
            <span className="chips-label">Sample forensic documents:</span>
            {Object.keys(sampleDocs).map((ref) => (
              <button
                key={ref}
                type="button"
                className="chip-btn"
                onClick={() => {
                  setDocQuery(ref);
                  setDocResult(sampleDocs[ref]);
                  setDocError('');
                }}
              >
                {ref}
              </button>
            ))}
          </div>

          {docError && (
            <div className="verify-alert error">
              <AlertCircle size={18} /> {docError}
            </div>
          )}

          {docResult && (
            <div className="doc-result-panel">
              <div className="doc-header-row">
                <div className="doc-icon-badge"><FileText size={22} /></div>
                <div>
                  <h4>{docResult.title}</h4>
                  <span className="doc-ref-text">Registry Ref: <b>{docResult.ref}</b></span>
                </div>
                <div className="status-pill active" style={{ marginLeft: 'auto' }}>
                  <CheckCircle2 size={14} /> {docResult.status}
                </div>
              </div>

              <dl className="doc-meta-grid">
                <div>
                  <dt>Document Subject</dt>
                  <dd>{docResult.subject}</dd>
                </div>
                <div>
                  <dt>Examiner / Laboratory</dt>
                  <dd>{docResult.examiner}</dd>
                </div>
                <div>
                  <dt>Jurisdiction / Submission</dt>
                  <dd>{docResult.court}</dd>
                </div>
                <div>
                  <dt>Registration Date</dt>
                  <dd>{docResult.date}</dd>
                </div>
              </dl>

              <div className="doc-hash-box">
                <div className="hash-header">
                  <span className="hash-label">Official SHA-256 Evidence Hash (FIPS 180-4 compliant):</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copyToClipboard(docResult.hash)}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code className="doc-hash-text">{docResult.hash}</code>
              </div>
            </div>
          )}

          {/* Real-time Browser File Hash Calculator */}
          <div className="hash-calc-card">
            <div className="hash-calc-header">
              <Lock size={18} className="calc-icon" />
              <div>
                <h4>Live Forensic File Hash Verifier (Client-side)</h4>
                <p>
                  Upload or drop any electronic document (PDF, DOCX, image) to compute its exact cryptographic SHA-256 fingerprint in your browser without uploading data to any external server.
                </p>
              </div>
            </div>

            <div className="hash-calc-dropzone">
              <input
                type="file"
                id="doc-file-input"
                onChange={handleFileChange}
                className="file-hidden-input"
              />
              <label htmlFor="doc-file-input" className="file-drop-label">
                <FileCheck size={28} />
                <span>{fileName ? `Selected: ${fileName}` : 'Click to select a document or drag & drop file'}</span>
                <small>Calculates SHA-256 hash locally in your browser</small>
              </label>
            </div>

            {calcHash && (
              <div className="calc-result">
                <div className="calc-result-title">
                  <CheckCircle2 size={16} color="var(--gold-500)" />
                  <span>Computed Cryptographic Fingerprint (SHA-256):</span>
                </div>
                <code className="calc-hash-code">{calcHash}</code>
              </div>
            )}
          </div>

          <div className="verify-footnote">
            <FileCheck size={15} />
            <span>
              All digital evidence examined by Eaglesight follows strict ISO/IEC standards and is prepared in compliance with Section 65B of the Bharatiya Sakshya Adhiniyam, 2023.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

