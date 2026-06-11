import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const email = decoded.split(':')[0];

      return NextResponse.json({
        authenticated: true,
        user: { email, role: 'admin', name: 'Admin' },
      });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }

  return NextResponse.json({ authenticated: false });
}
