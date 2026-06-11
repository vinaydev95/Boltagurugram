import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      const response = NextResponse.json({
        success: true,
        user: { email, role: 'admin', name: 'Admin' },
      });

      // Set HTTP-only cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
