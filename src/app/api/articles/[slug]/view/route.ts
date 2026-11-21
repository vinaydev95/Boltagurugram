import { NextResponse } from 'next/server';
import { incrementArticleViewsDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await incrementArticleViewsDB(params.slug);
    return new NextResponse(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Article view tracking failed:', error);
    return NextResponse.json(
      { error: 'View tracking temporarily unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
