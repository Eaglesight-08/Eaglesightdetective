import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/server-auth';

export async function GET(request) {
  const token = request.cookies.get('eagle_admin_session')?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}
