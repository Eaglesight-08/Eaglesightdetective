export const company = {
  name: 'Eaglesight Detective Services Private Limited',
  short: 'Eaglesight',
  tagline: 'Skilled Detectives for a Safer Digital World',
  cin: 'U62020TZ2026PTC041075',
  iso: 'ISO/IEC 27032:2012',
  phone: '+91 73053 73567',
  phoneHref: 'tel:+917305373567',
  email: 'eaglesightteam@gmail.com',
  website: 'www.esdspvtltd.in',
  addressLines: ['2/257-C Eippan Nagar, Chinnampalayam,', 'Pollachi, Coimbatore - 642001,', 'Tamil Nadu, India'],
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Chinnampalayam%2C+Pollachi%2C+Coimbatore+642001',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/academy', label: 'Academy' },
  { href: '/incident-response', label: 'Incident Response' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const pillars = ['People', 'Technology', 'Intelligence', 'A Safer Digital India'];

export const services = [
  {
    id: 'cyber-security',
    icon: 'shield',
    title: 'Cyber Security',
    lead: 'Vulnerability assessment, penetration testing and continuous defence for your business.',
    intro:
      'Our offensive security team finds weaknesses before attackers do. We test web applications, APIs, cloud accounts and internal networks the way a real adversary would, then help you fix what we find.',
    items: [
      ['Web & API penetration testing', 'Testing against the OWASP Top 10, business-logic flaws, injection and access-control issues.'],
      ['Red teaming', 'Realistic attack simulation covering phishing, Active Directory and lateral movement.'],
      ['Cloud security review', 'AWS, Azure and GCP configuration audits with least-privilege IAM and container checks.'],
      ['Managed detection & threat hunting', 'Ongoing monitoring of logs and endpoints to catch intrusions early.'],
    ],
    deliverables: ['Executive risk summary', 'Technical findings with proof of concept', 'Step-by-step remediation plan', 'Re-test and closure certificate'],
  },
  {
    id: 'digital-forensics',
    icon: 'fingerprint',
    title: 'Digital Forensics',
    lead: 'Court-ready recovery and analysis of evidence from computers, phones and the cloud.',
    intro:
      'Our Pollachi laboratory uses write-blockers, isolation enclosures and validated tools to recover electronic evidence without altering it, and documents every step for the courtroom.',
    items: [
      ['Computer & server forensics', 'Forensic imaging, deleted-file recovery and timeline reconstruction.'],
      ['Mobile forensics', 'iOS and Android extraction including chats, media and location history.'],
      ['Cryptocurrency tracing', 'Following funds across Bitcoin, Ethereum and USDT to identify wallets.'],
      ['Section 65B certification', 'Electronic-record certificates prepared under the Bharatiya Sakshya Adhiniyam, 2023.'],
    ],
    deliverables: ['Hash-verified forensic images', 'Chain-of-custody records', 'Detailed forensic report', 'Expert witness support'],
  },
  {
    id: 'investigation-support',
    icon: 'search',
    title: 'Investigation Support',
    lead: 'Discreet digital investigations into fraud, data theft and corporate espionage.',
    intro:
      'We help organisations and legal teams uncover what happened, who was involved and how data left the building — quietly and lawfully.',
    items: [
      ['Insider threat & IP theft', 'Tracing data exfiltration through email, USB devices and cloud storage.'],
      ['Dark web monitoring', 'Watching underground forums for leaked databases and staff credentials.'],
      ['Bug sweeping (TSCM)', 'Physical and RF sweeps for hidden microphones, cameras and GPS trackers.'],
      ['Cyber fraud & extortion', 'Crisis advisory and evidence gathering for ransomware and extortion cases.'],
    ],
    deliverables: ['Confidential findings report', 'Evidence pack for counsel', 'Recommended next actions', 'Liaison support with authorities'],
  },
  {
    id: 'training-consulting',
    icon: 'users',
    title: 'Training & Consulting',
    lead: 'ISO/IEC 27032 advisory, DPDP Act readiness and professional cyber detective courses.',
    intro:
      'We build lasting security capability inside your organisation through standards-based consulting, leadership workshops and hands-on certification programmes.',
    items: [
      ['ISO/IEC 27032 consulting', 'Gap analysis, roadmap and implementation support.'],
      ['DPDP Act 2023 compliance', 'Privacy frameworks, consent workflows and governance controls.'],
      ['Cyber Detective Academy', 'Practical certification courses for professionals and students.'],
      ['Executive crisis exercises', 'Table-top ransomware simulations for boards and leadership.'],
    ],
    deliverables: ['Gap assessment report', 'Policy and process templates', 'Staff awareness sessions', 'Certificates of completion'],
  },
];

export const workflow = [
  ['Secure & preserve', 'Evidence is isolated, photographed and logged with a documented chain of custody from the first minute.'],
  ['Forensic imaging', 'Media is copied through hardware write-blockers and verified with SHA-256 hashes, so the original is never changed.'],
  ['Laboratory analysis', 'Deleted data, chat databases, malware and timelines are examined on isolated workstations.'],
  ['Report & testify', 'Findings are delivered as a clear, court-ready report with Section 65B certification and expert testimony if needed.'],
];

export const courses = [
  {
    code: 'CCD',
    title: 'Certified Cyber Detective',
    duration: '12 weeks',
    level: 'Intermediate – Advanced',
    summary: 'Our flagship programme covering cyber law, OSINT, dark web intelligence, incident response and mobile forensics.',
  },
  {
    code: 'DFMES',
    title: 'Digital Forensics & Mobile Extraction Specialist',
    duration: '8 weeks',
    level: 'Hands-on labs',
    summary: 'Practical evidence acquisition and analysis of computers and smartphones using industry tools.',
  },
  {
    code: 'VAPT',
    title: 'Enterprise VAPT & Red Teaming',
    duration: '10 weeks',
    level: 'Offensive security',
    summary: 'Web, network and Active Directory penetration testing with practical attack labs.',
  },
  {
    code: 'DPDP',
    title: 'DPDP Act 2023 & Cyber Law Practitioner',
    duration: '4 weeks',
    level: 'Legal & compliance',
    summary: 'Executive programme on India’s data protection law, compliance and cyber-crime procedure.',
  },
];

export const ccdModules = [
  'Cyber crime law & the Bharatiya Sakshya Adhiniyam, 2023',
  'Open-source intelligence (OSINT) & profiling',
  'Dark web intelligence & cryptocurrency tracing',
  'Live incident response & memory acquisition',
  'Mobile, WhatsApp & Telegram forensics',
  'Mock trial, 65B certification & expert testimony',
];
