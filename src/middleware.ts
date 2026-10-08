import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Clean 301 redirect for www -> non-www (avoids 308 code which AdSense crawler drops)
  if (host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    const url = request.nextUrl.clone();
    url.host = newHost;
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, logo.gif (static media)
     * - robots.txt, sitemap.xml, ads.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|logo.gif|robots.txt|sitemap.xml|ads.txt).*)',
  ],
};
