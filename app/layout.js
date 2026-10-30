import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import './extras.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import ScrollFx from '@/components/ScrollFx';
import Preloader from '@/components/Preloader';
import Interactions from '@/components/Interactions';
import NetworkStatus from '@/components/NetworkStatus';

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.esdspvtltd.in'),
  title: {
    default: 'Eaglesight Detective Services | Cyber Detectives',
    template: '%s | Eaglesight Detective Services',
  },
  description:
    'ISO/IEC 27032:2012 certified cyber security, digital forensics, investigation support and training from Pollachi, Coimbatore. Skilled detectives for a safer digital world.',
  keywords: [
    'Cyber Detectives',
    'Digital Forensics India',
    'Eaglesight Detective Services',
    'VAPT',
    'Incident Response',
    'Mobile Forensics',
    'ISO 27032',
    'Coimbatore Cyber Crime',
    'Pollachi Cyber Security',
    'Section 65B',
  ],
  icons: { icon: '/images/eagle_logo_clean.png', apple: '/images/eagle_logo_clean.png' },
  openGraph: {
    title: 'Eaglesight Detective Services | Cyber Detectives',
    description: 'People · Technology · Intelligence · A Safer Digital India.',
    url: 'https://www.esdspvtltd.in',
    siteName: 'Eaglesight Detective Services',
    images: [{ url: '/images/forensics_lab.jpg', width: 1376, height: 768, alt: 'Eaglesight forensic laboratory' }],
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport = { themeColor: '#111e3d' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>.preloader{display:none!important}.reveal,.hero-in>*,.hero h1 .word,.hero-visual,.hero-chip,.strip-item,.seal-card,.page-head .container>*{opacity:1!important;transform:none!important;animation:none!important}.photo{clip-path:none!important}</style>',
          }}
        />
      </head>
      <body>
        <Preloader />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Reveal />
        <ScrollFx />
        <Interactions />
        <NetworkStatus />
      </body>
    </html>
  );
}
