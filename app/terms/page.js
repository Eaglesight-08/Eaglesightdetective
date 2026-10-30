import { company } from '@/lib/site';
import PageHead from '@/components/PageHead';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of engagement, confidentiality and academy terms for Eaglesight Detective Services.',
};

export default function TermsPage() {
  return (
    <>
      <PageHead eyebrow="Terms of service" title="Terms of Service">
        Eaglesight Detective Services Private Limited (CIN: {company.cin}). Incorporated under the Companies Act 2013,
        Tamil Nadu, India.
      </PageHead>

      <section className="section">
        <div className="container narrow prose">
          <h2>1. Scope of engagements</h2>
          <p>
            All investigations, vulnerability assessments, forensic examinations and penetration tests are carried out only
            under a lawful, authorised mandate. The client confirms that they own, or are formally authorised to act for, all
            hardware, networks, accounts and servers submitted for testing or examination.
          </p>

          <h2>2. Compliance with Indian law</h2>
          <p>
            Our forensic work and reports follow <strong>Section 65B of the Indian Evidence Act</strong> (now the corresponding
            provisions of the Bharatiya Sakshya Adhiniyam, 2023) and the <strong>Information Technology Act 2000</strong>. We
            maintain a documented chain of custody from the moment evidence is received.
          </p>

          <h2>3. Confidentiality</h2>
          <p>
            We sign a non-disclosure agreement with every client before casework begins. Our staff remain bound by
            confidentiality indefinitely. Case details, findings and client identities are never shared with unauthorised
            parties, except where required by a court of competent jurisdiction.
          </p>

          <h2>4. Penetration testing rules of engagement</h2>
          <p>
            VAPT and red-team work is limited to the IP ranges, domains and applications listed in the signed Rules of
            Engagement. We use industry-standard safeguards to avoid service disruption or data loss during testing.
          </p>

          <h2>5. Academy & certification</h2>
          <p>
            Course fees cover tuition, lab access and certification assessments. Certificates are awarded only on successful
            completion of the required lab modules and assessments.
          </p>

          <div className="box">
            <h2>6. Company details</h2>
            <p>For legal notices and engagement agreements:</p>
            <dl>
              <dt>Entity</dt><dd>Eaglesight Detective Services Private Limited</dd>
              <dt>CIN</dt><dd>{company.cin}</dd>
              <dt>Registered office</dt><dd>{company.addressLines.join(' ')}</dd>
              <dt>Phone</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd>
              <dt>Website</dt><dd>{company.website}</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
