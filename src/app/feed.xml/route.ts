import { NextResponse } from 'next/server';
import { getLatestArticlesDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://boltagurugram.com';

  let articles: any[] = [];
  try {
    articles = await getLatestArticlesDB(50);
  } catch (error) {
    console.error('Error fetching articles for RSS feed:', error);
  }

  const itemsXml = articles
    .map((article: any) => {
      const pubDate = article.created_at ? new Date(article.created_at).toUTCString() : new Date().toUTCString();
      const articleUrl = `${baseUrl}/article/${article.slug}`;
      const imageUrl = article.image_url || `${baseUrl}/logo.png`;
      const author = article.author || 'Bolta Gurugram Desk';
      const category = article.category_name || 'General';

      return `    <item>
      <title><![CDATA[${article.title || ''}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <category><![CDATA[${category}]]></category>
      <description><![CDATA[${article.excerpt || article.meta_description || article.title}]]></description>
      ${article.image_url ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />
      <media:content url="${escapeXml(imageUrl)}" medium="image" />` : ''}
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Bolta Gurugram - Latest News &amp; Updates</title>
    <link>${baseUrl}</link>
    <description>गुरुग्राम और हरियाणा की सबसे विश्वसनीय डिजिटल हिंदी न्यूज़ वेबसाइट।</description>
    <language>hi-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Bolta Gurugram</title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=1200, stale-while-revalidate=86400',
    },
  });
}

