import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getArticlesBySearchDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: `Search Results for "${query}" | Live News`,
    description: `Search results for ${query} on Live News.`,
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  const articles = query ? await getArticlesBySearchDB(query, 20) : [];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>
        <div style={{ borderBottom: '3px solid var(--primary-color)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="page-title">SEARCH RESULTS</h1>
          {query && <span style={{ backgroundColor: '#e5e7eb', color: 'var(--text-light)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{articles.length} Results for &quot;{query}&quot;</span>}
        </div>

        {!query ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Please enter a search term</h2>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No articles found for &quot;{query}&quot;</h2>
            <Link href="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>← Back to Home</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {articles.map((article: any) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <article className="search-article">
                  <div className="search-article-img">
                    {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{article.category_name}</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: '1.3' }}>{article.title}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '1rem', lineHeight: '1.5' }}>{article.excerpt}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#9ca3af', fontWeight: '500', flexWrap: 'wrap' }}>
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
