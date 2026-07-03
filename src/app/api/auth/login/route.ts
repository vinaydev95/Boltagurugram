import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    let user = null;

    if (email === adminEmail && password === adminPassword) {
      user = { email, role: 'admin', name: 'Admin' };
    } else {
      // Check database for reporter
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM reporters WHERE email = ? AND password = ?',
        [email, password]
      );

      if (rows.length > 0) {
        const reporter = rows[0];
        user = { email: reporter.email, role: 'reporter', name: reporter.name };
      }
    }

    if (user) {
      // Create a simple token containing email, role, and name (in production, use JWT)
      const token = Buffer.from(`${user.email}:${user.role}:${user.name}:${Date.now()}`).toString('base64');

      const response = NextResponse.json({
        success: true,
        user,
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
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
