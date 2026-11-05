import { NextResponse } from 'next/server';
import { verifySessionToken, updateAdminCredentials, getAdminCredentials } from '@/lib/server-auth';
import fs from 'fs/promises';
import path from 'path';

function checkAuth(request) {
  const token = request.cookies.get('eagle_admin_session')?.value;
  return verifySessionToken(token);
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const creds = await getAdminCredentials();
    const filePath = path.join(process.cwd(), 'admin-credentials.md');
    let rawMarkdown = '';
    try {
      rawMarkdown = await fs.readFile(filePath, 'utf-8');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      username: creds.username,
      role: creds.role,
      rawMarkdown,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username, password } = await request.json();
    if (!password || password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    await updateAdminCredentials(username, password);

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated and stored in admin-credentials.md successfully!',
    });
  } catch (err) {
    console.error('Credentials update error:', err);
    return NextResponse.json(
      { error: 'Failed to update credentials file.' },
      { status: 500 }
    );
  }
}
