'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Phone, Mail, ChevronDown, ArrowRight, Siren, Newspaper, HelpCircle, LifeBuoy, Briefcase, Building2, Info,
} from 'lucide-react';
import { company, services } from '@/lib/site';
import ServiceIcon from './ServiceIcon';

const companyLinks = [
  { href: '/about', label: 'About us', desc: 'Our story, pillars and credentials', icon: Info },
  { href: '/industries', label: 'Industries', desc: 'Who we protect and how', icon: Building2 },
  { href: '/careers', label: 'Careers', desc: 'Join our investigation team', icon: Briefcase },
];

const resourceLinks = [
  { href: '/insights', label: 'Insights', desc: 'Guides, alerts and explainers', icon: Newspaper },
  { href: '/resources', label: 'Cyber help desk', desc: 'Report cybercrime, helplines, checklists', icon: LifeBuoy },
  { href: '/faq', label: 'FAQ', desc: 'Answers to common questions', icon: HelpCircle },
];

const mobileLinks = [
  ['/', 'Home'], ['/services', 'Services'], ['/industries', 'Industries'], ['/academy', 'Academy'],
  ['/insights', 'Insights'], ['/resources', 'Cyber help desk'], ['/about', 'About'], ['/careers', 'Careers'],
  ['/faq', 'FAQ'], ['/contact', 'Contact'],
];

function Drop({ id, label, active, menu, setMenu, children }) {
  return (
    <div className={`nav-item${menu === id ? ' open' : ''}`} onMouseEnter={() => setMenu(id)} onMouseLeave={() => setMenu(null)}>
      <button
        className={`nav-link${active ? ' active' : ''}`}
        aria-expanded={menu === id}
        onClick={() => setMenu(id)}
      >
        {label} <ChevronDown className="chev" />
      </button>
      <div className="mega" role="menu">{children}</div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMenu(null); }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e) => { if (!e.target.closest('.nav-item')) setMenu(null); };
    const onKey = (e) => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const groupActive = (links) => links.some((l) => isActive(l.href));

  return (
    <>
      <div className="announce">
        <div className="container">
          <span className="announce-pill">New guide</span>
          <Link href="/insights/spot-whatsapp-scams" className="announce-link">
            Seven WhatsApp scams to watch for in 2026 <ArrowRight />
          </Link>
        </div>
      </div>

      <div className="topbar">
        <div className="container">
          <div className="topbar-left">
            <span>CIN: <b>{company.cin}</b></span>
            <span className="sep" />
            <span>{company.iso}</span>
          </div>
          <div className="topbar-right">
            <Link href="/incident-response" className="sos-link"><Siren /> Under attack? Get help</Link>
            <a href={company.phoneHref}><Phone /> {company.phone}</a>
            <a href={`mailto:${company.email}`} className="hide-sm"><Mail /> {company.email}</a>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Eaglesight Detective Services — home">
            <Image src="/images/eagle_logo_clean.png" alt="" width={116} height={116} priority />
            <span className="brand-divider" />
            <span className="brand-text">
              <span className="brand-name">EAGLESIGHT</span>
              <span className="brand-sub">DETECTIVE SERVICES PVT. LTD.</span>
              <span className="brand-tag">CYBER DETECTIVES</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main">
            <Link href="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>Home</Link>

            <Drop menu={menu} setMenu={setMenu} id="services" label="Services" active={isActive('/services')}>
              <div className="mega-grid wide">
                <div className="mega-links">
                  {services.map((s) => (
                    <Link key={s.id} href={`/services/${s.id}`} className="mega-link">
                      <span className="icon-badge sm"><ServiceIcon name={s.icon} /></span>
                      <span><b>{s.title}</b><small>{s.lead}</small></span>
                    </Link>
                  ))}
                </div>
                <div className="mega-feature">
                  <span className="eyebrow">24/7 response</span>
                  <p>Facing an active attack? Our first responders contain the threat and preserve evidence.</p>
                  <Link href="/incident-response" className="btn btn-gold">Get help now <ArrowRight /></Link>
                  <Link href="/services" className="link-arrow light">All services <ArrowRight /></Link>
                </div>
              </div>
            </Drop>

            <Link href="/academy" className={`nav-link${isActive('/academy') ? ' active' : ''}`}>Academy</Link>

            <Drop menu={menu} setMenu={setMenu} id="resources" label="Resources" active={groupActive(resourceLinks)}>
              <div className="mega-grid">
                {resourceLinks.map(({ href, label, desc, icon: Icon }) => (
                  <Link key={href} href={href} className="mega-link">
                    <span className="icon-badge sm"><Icon /></span>
                    <span><b>{label}</b><small>{desc}</small></span>
                  </Link>
                ))}
              </div>
            </Drop>

            <Drop menu={menu} setMenu={setMenu} id="company" label="Company" active={groupActive(companyLinks)}>
              <div className="mega-grid">
                {companyLinks.map(({ href, label, desc, icon: Icon }) => (
                  <Link key={href} href={href} className="mega-link">
                    <span className="icon-badge sm"><Icon /></span>
                    <span><b>{label}</b><small>{desc}</small></span>
                  </Link>
                ))}
              </div>
            </Drop>

            <Link href="/contact" className={`nav-link${isActive('/contact') ? ' active' : ''}`}>Contact</Link>
          </nav>

          <div className="header-cta">
            <Link href="/contact" className="btn btn-navy" data-magnetic>Book a consultation</Link>
            <button
              className={`menu-btn${open ? ' is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="container">
          {mobileLinks.map(([href, label]) => (
            <Link key={href} href={href} className={isActive(href) ? 'active' : undefined} tabIndex={open ? 0 : -1}>
              {label} <ArrowRight />
            </Link>
          ))}
          <Link href="/incident-response" className="btn btn-gold btn-block" tabIndex={open ? 0 : -1}><Siren /> Under attack? Get help</Link>
          <Link href="/contact" className="btn btn-navy btn-block" tabIndex={open ? 0 : -1}>Book a consultation</Link>
        </div>
      </div>
    </>
  );
}
