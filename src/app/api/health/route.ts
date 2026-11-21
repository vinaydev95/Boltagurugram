import { NextResponse } from 'next/server';
import { queryRows } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const articles = await queryRows("SELECT id FROM articles WHERE status = 'Published' LIMIT 1");
    if (articles.length === 0) {
      return NextResponse.json({ status: 'unavailable' }, { status: 503, headers });
    }
    return NextResponse.json({ status: 'ready' }, { headers });
  } catch {
    return NextResponse.json({ status: 'unavailable' }, { status: 503, headers });
  }
}
