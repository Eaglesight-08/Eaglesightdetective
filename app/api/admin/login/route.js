import { NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken } from '@/lib/server-auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const isValid = await verifyCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });

    response.cookies.set({
      name: 'eagle_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Server authentication failure.' },
      { status: 500 }
    );
  }
}
