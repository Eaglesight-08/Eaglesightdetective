import Link from 'next/link';
import Image from 'next/image';

export default function PageHead({ eyebrow, title, children, actions }) {
  return (
    <section className="page-head">
      <Image src="/images/eagle_mark.png" alt="" width={600} height={380} className="hero-watermark" aria-hidden="true" />
      <div className="container" style={{ position: 'relative' }}>
        <div className="crumbs">
          <Link href="/">Home</Link> &nbsp;/&nbsp; {eyebrow}
        </div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}
