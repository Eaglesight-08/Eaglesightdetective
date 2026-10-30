import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Eaglesight Detective Services collects, protects and disposes of client data under the DPDP Act 2023.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHead eyebrow="Privacy policy" title="Privacy Policy">
        Eaglesight Detective Services Private Limited (CIN: {company.cin}). Aligned with the DPDP Act 2023, the IT Act 2000
        and {company.iso}.
      </PageHead>

      <section className="section">
        <div className="container narrow prose">
          <h2>1. Our commitment to confidentiality</h2>
          <p>
            Eaglesight Detective Services Private Limited (“Eaglesight”, “we”, “our”) is a corporate intelligence and digital
            forensics firm. Our clients trust us with sensitive records, trade secrets and evidence. This policy explains how
            we collect, process, protect and destroy data in accordance with the <strong>Digital Personal Data Protection (DPDP)
            Act 2023</strong>, the <strong>Information Technology Act 2000</strong> (and the Reasonable Security Practices
            Rules), and <strong>{company.iso}</strong>.
          </p>

          <h2>2. Data we collect</h2>
          <p>We collect and process data only within the authorised scope of our written engagement:</p>
          <ul>
            <li><strong>Client identification:</strong> name, designation, organisation, phone, email and identification documents.</li>
            <li><strong>Forensic artefacts & evidence:</strong> disk images, memory dumps, mobile extractions, network captures and system logs provided during an engagement.</li>
            <li><strong>Incident details:</strong> symptoms of a breach, suspicious IP addresses, ransom notes and wallet addresses submitted to us.</li>
            <li><strong>Academy records:</strong> enrolment details, payments, educational background and assessment results.</li>
          </ul>

          <h2>3. Purpose of processing & chain of custody</h2>
          <p>
            Evidence acquired during forensic engagements is handled in line with <strong>Section 65B of the Indian Evidence
            Act</strong> and the Bharatiya Sakshya Adhiniyam, 2023. Forensic artefacts are processed on isolated workstations in
            our Pollachi laboratory and are not stored on public cloud services. Cryptographic hashes are recorded at
            acquisition to prove integrity.
          </p>

          <h2>4. Non-disclosure</h2>
          <p>We do not sell, rent, license or monetise client data. Evidence is disclosed only to:</p>
          <ul>
            <li>The authorised client representative or legal counsel named in the engagement.</li>
            <li>Courts or law-enforcement agencies under a valid court order or legal requirement (BNSS / CrPC).</li>
          </ul>

          <h2>5. Retention & secure disposal</h2>
          <p>
            After proceedings conclude or the final report is signed off, forensic master copies are kept in secure storage for
            the period required by law or as instructed in writing by the client’s counsel. Media are then sanitised in line
            with NIST SP 800-88 and destroyed.
          </p>

          <h2>6. Your rights under the DPDP Act 2023</h2>
          <p>
            You may request access to your personal data, correction of inaccurate records, and withdrawal of consent for
            non-statutory processing. Please contact our Grievance Officer below.
          </p>

          <div className="box">
            <h2>7. Grievance Officer</h2>
            <p>For privacy questions, evidence-disposal certificates or DPDP Act requests, contact:</p>
            <dl>
              <dt>Officer</dt><dd>Legal Desk, Eaglesight Detective Services</dd>
              <dt>Address</dt><dd>{company.addressLines.join(' ')}</dd>
              <dt>Phone</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd>
              <dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
              <dt>CIN</dt><dd>{company.cin}</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
