import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readSubmissionsFromMd } from '@/lib/markdown-db';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = (searchParams.get('id') || '').trim();
    if (!rawId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const q = rawId.toUpperCase();

    // 1. Check official operatives
    if (sampleMembers[q]) {
      return NextResponse.json({ success: true, member: sampleMembers[q] });
    }

    // 2. Check submissions registry (including ENQ-2026-XXXX)
    const submissions = await readSubmissionsFromMd();
    const found = submissions.find(
      (s) =>
        (s.id && s.id.toUpperCase() === q) ||
        (s.name && s.name.toUpperCase() === q)
    );

    if (found) {
      const issuedDate = found.date ? new Date(found.date) : new Date();
      const validUntilDate = new Date(issuedDate);
      validUntilDate.setFullYear(validUntilDate.getFullYear() + 2);

      const hash = crypto
        .createHash('sha256')
        .update(found.id + (found.name || '') + (found.date || ''))
        .digest('hex')
        .slice(0, 48);

      const member = {
        id: found.id,
        name: found.name || 'Registered Operative',
        role: found.topic || 'Cyber Fraud & Field Investigator',
        division: (found.topic || '').toLowerCase().includes('forensic')
          ? 'Digital Forensics & Incident Response'
          : 'Cyber Security & Field Operations',
        status:
          found.status === 'Resolved'
            ? 'ACTIVE & RESOLVED'
            : found.status === 'In Progress'
            ? 'ACTIVE INVESTIGATION'
            : 'ACTIVE & VERIFIED',
        issued: issuedDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        validUntil: validUntilDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        jurisdiction: 'Tamil Nadu & Pan-India',
        hash,
        phone: found.phone || '',
        email: found.email || '',
        message: found.message || '',
      };

      return NextResponse.json({ success: true, member });
    }

    return NextResponse.json(
      { error: `No registered detective or operative found under ID "${rawId}".` },
      { status: 404 }
    );
  } catch (err) {
    if (err?.digest?.startsWith?.('NEXT_')) {
      throw err;
    }
    console.error('Verify API error:', err);
    return NextResponse.json(
      { error: 'Verification service error' },
      { status: 500 }
    );
  }
}
