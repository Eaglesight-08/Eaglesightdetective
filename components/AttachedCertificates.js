'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink, ShieldCheck, Eye, X, Award, CheckCircle2 } from 'lucide-react';
import { company } from '@/lib/site';

const attachedFiles = [
  {
    id: 'iso-27001',
    fileName: 'certificate-25-07-21158235.pdf',
    title: 'ISO/IEC 27001:2022 Certificate of Registration',
    subtitle: 'Information Security Management System (ISMS)',
    certNo: '25-07-21158235',
    issuedBy: 'Anglia Compliance Group, UK',
    validDate: '25/10/2026 to 24/10/2029',
    fileSize: '593 KB',
    fileType: 'PDF Document',
    downloadUrl: '/certificates/certificate-25-07-21158235.pdf',
    verifyUrl: 'https://www.angliacompliance.uk/verify-certificate',
    badge: 'ISO 27001:2022',
  },
  {
    id: 'gmp',
    fileName: 'certificate-25-07-21158238.pdf',
    title: 'GMP (Goods Manufacturing Practice) Certificate',
    subtitle: 'InfoSec & Forensics for GMP-Regulated Environments',
    certNo: '25-07-21158238',
    issuedBy: 'Anglia Compliance Group, UK',
    validDate: '25/10/2026 to 24/10/2029',
    fileSize: '611 KB',
    fileType: 'PDF Document',
    downloadUrl: '/certificates/certificate-25-07-21158238.pdf',
    verifyUrl: 'https://www.angliacompliance.uk/verify-certificate',
    badge: 'GMP CERTIFIED',
  },
];

export default function AttachedCertificates({ showTitle = true }) {
  const [activePdf, setActivePdf] = useState(null);

  return (
    <div className="attached-certs-wrap">
      {showTitle && (
        <div className="attached-certs-header">
          <div className="attached-header-badge">
            <Award size={18} />
            <span>Official Attached Registrations</span>
          </div>
          <h3>Official Verifiable PDF Certificates</h3>
          <p>
            Download, inspect, or verify the authentic registration documents issued to Eaglesight Detective Services Private Limited by Anglia Compliance Group UK.
          </p>
        </div>
      )}

      <div className="attached-files-grid">
        {attachedFiles.map((f) => (
          <div key={f.id} className="attached-file-card">
            <div className="attached-file-top">
              <div className="pdf-icon-badge">
                <FileText size={24} />
                <span className="pdf-tag">PDF</span>
              </div>
              <div className="attached-file-meta">
                <span className="file-chip">{f.badge}</span>
                <span className="file-size-text">{f.fileSize}</span>
              </div>
            </div>

            <div className="attached-file-info">
              <h4 className="attached-file-title">{f.title}</h4>
              <p className="attached-file-sub">{f.subtitle}</p>

              <div className="attached-file-details">
                <div className="afd-row">
                  <span>Certificate No:</span>
                  <b className="mono">{f.certNo}</b>
                </div>
                <div className="afd-row">
                  <span>Accreditation:</span>
                  <b>{f.issuedBy}</b>
                </div>
                <div className="afd-row">
                  <span>Validity:</span>
                  <b className="text-green">{f.validDate}</b>
                </div>
                <div className="afd-row">
                  <span>File Name:</span>
                  <code className="text-muted">{f.fileName}</code>
                </div>
              </div>
            </div>

            <div className="attached-file-actions">
              <a
                href={f.downloadUrl}
                download={f.fileName}
                className="btn btn-navy btn-sm"
              >
                <Download size={14} /> Download PDF
              </a>
              <button
                type="button"
                onClick={() => setActivePdf(f)}
                className="btn btn-outline btn-sm"
              >
                <Eye size={14} /> View in Browser
              </button>
              <a
                href={f.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-sm"
                title="Verify at Anglia Compliance UK"
              >
                <ExternalLink size={14} /> Verify
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Modal PDF Viewer */}
      {activePdf && (
        <div className="pdf-modal-backdrop" onClick={() => setActivePdf(null)}>
          <div className="pdf-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <div className="pdf-modal-title">
                <FileText size={20} color="var(--gold-400)" />
                <div>
                  <h4>{activePdf.title}</h4>
                  <small>Certificate No: {activePdf.certNo} · {activePdf.fileName}</small>
                </div>
              </div>
              <div className="pdf-modal-actions">
                <a
                  href={activePdf.downloadUrl}
                  download={activePdf.fileName}
                  className="btn btn-gold btn-sm"
                >
                  <Download size={14} /> Download
                </a>
                <a
                  href={activePdf.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm light"
                >
                  <ExternalLink size={14} /> Open Fullscreen
                </a>
                <button
                  type="button"
                  className="pdf-close-btn"
                  onClick={() => setActivePdf(null)}
                  aria-label="Close PDF viewer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="pdf-modal-body">
              <iframe
                src={`${activePdf.downloadUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                title={activePdf.title}
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

