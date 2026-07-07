import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getArticlesByCategoryDB, getCategoryBySlugDB, getTrendingArticlesDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const cat = await getCategoryBySlugDB(decodedSlug);
  const name = cat?.name || decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
  return {
    title: `${name} News | Bolta Gurugram`,
    description: `Latest breaking news, updates, and analysis on ${name}. Stay updated with Bolta Gurugram.`,
    openGraph: {
      title: `${name} News | Bolta Gurugram`,
      description: `Latest breaking news, updates, and analysis on ${name}. Stay updated with Bolta Gurugram.`,
      url: `https://boltagurugram.com/category/${decodedSlug}`,
      siteName: 'Bolta Gurugram',
    }
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const cat = await getCategoryBySlugDB(decodedSlug);
  const categoryName = cat?.name || decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
  const categoryArticles = await getArticlesByCategoryDB(decodedSlug, 20);
  const trending = await getTrendingArticlesDB(4);
  const featuredArticle = categoryArticles[0];
  const listArticles = categoryArticles.slice(1);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>
        <div style={{ borderBottom: '3px solid var(--primary-color)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="page-title">{categoryName} NEWS</h1>
          <span style={{ backgroundColor: '#e5e7eb', color: 'var(--text-light)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{categoryArticles.length} Articles</span>
        </div>

        {categoryArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No articles found in {categoryName}</h2>
            <Link href="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>← Back to Home</Link>
          </div>
        ) : (
          <div className="grid-category">

            {/* Main Category Feed */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* Featured Category Story */}
              {featuredArticle && (
                <Link href={`/article/${featuredArticle.slug}`}>
                  <div className="category-featured">
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.2' }}>{featuredArticle.title}</h2>
                      <p style={{ fontSize: '1rem', color: '#d1d5db', marginBottom: '1rem' }}>{featuredArticle.excerpt}</p>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>By {featuredArticle.author} • {featuredArticle.date}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {listArticles.map((article: any) => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <article className="category-article">
                      <div className="category-article-img">
                        {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.3' }}>{article.title}</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>{article.excerpt}</p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500', flexWrap: 'wrap' }}>
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.read_time} read</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>

            {/* Right Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>Trending</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trending.map((item: any, idx: number) => (
                    <li key={item.id}>
                      <Link href={`/article/${item.slug}`}>
                        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: idx !== trending.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: idx !== trending.length - 1 ? '1rem' : '0', cursor: 'pointer' }}>
                          <div style={{ width: '60px', height: '60px', backgroundColor: '#e5e7eb', borderRadius: '4px', flexShrink: 0, overflow: 'hidden' }}>
                            {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.3' }}>{item.title}</h4>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ height: '300px', backgroundColor: '#f3f4f6', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                Sidebar Advertisement
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
