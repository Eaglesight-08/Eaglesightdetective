import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="status-page">
      <Image src="/images/eagle_mark.png" alt="" width={600} height={380} className="hero-watermark" aria-hidden="true" />
      <div className="container" style={{ position: 'relative' }}>
        <div className="status-code">404</div>
        <span className="eyebrow center">Case not found</span>
        <h1>Even our detectives couldn’t find this page</h1>
        <p>The link may be broken or the page may have moved. Let’s get you back on track.</p>
        <div className="hero-actions">
          <Link href="/" className="btn btn-navy"><Home /> Back to home</Link>
          <Link href="/services" className="btn btn-outline">Our services <ArrowRight /></Link>
          <Link href="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
