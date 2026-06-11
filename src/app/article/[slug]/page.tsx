import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getArticleBySlugDB, getRelatedArticlesDB, getLatestArticlesDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlugDB(params.slug);
  const title = article?.title || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const desc = article?.excerpt || `Read the latest news about ${title}.`;
  return {
    title: `${title} | Live News`,
    description: desc,
    openGraph: {
      title: `${title} | Live News`,
      description: desc,
      type: 'article',
      url: `https://livenews.com/article/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Live News`,
      description: desc,
    }
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlugDB(params.slug);

  if (!article) {
    const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem', flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>Article Not Found</h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>The article &quot;{title}&quot; could not be found.</p>
          <Link href="/" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 'bold' }}>← Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = await getRelatedArticlesDB(article.slug, article.category_id, 4);
  const moreArticles = (await getLatestArticlesDB(5)).filter((a: any) => a.slug !== article.slug).slice(0, 4);
  const catSlug = article.category_slug || article.category_name?.toLowerCase();
  const tags = article.tagsArray || [];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/category/${catSlug}`}>{article.category_name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-dark)' }}>{article.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '3rem' }}>

          {/* Main Article Content */}
          <article style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

            <Link href={`/category/${catSlug}`}>
              <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block', cursor: 'pointer' }}>{article.category_name}</span>
            </Link>

            <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>{article.title}</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-light)' }}>{article.author?.split(' ').map((n: string) => n[0]).join('')}</div>
                <div>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{article.author}</p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>Published on {article.date} • {article.read_time} read</p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1877F2', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>f</button>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1DA1F2', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>t</button>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>w</button>
              </div>
            </div>

            {/* Featured Image */}
            <div style={{ width: '100%', height: '450px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', overflow: 'hidden' }}>
              {article.image_url ? (
                <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                'Featured Image (1200x630)'
              )}
            </div>

            {/* Article Body */}
            <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#374151' }} dangerouslySetInnerHTML={{ __html: article.content || '' }} />

            {/* Article Tags */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Tags:</span>
                {tags.map((tag: string) => (
                  <span key={tag} style={{ backgroundColor: '#f3f4f6', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>{tag}</span>
                ))}
              </div>
            )}
          </article>

          {/* Right Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>Related News</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(related.length > 0 ? related : moreArticles).map((item: any, idx: number, arr: any[]) => (
                  <li key={item.id}>
                    <Link href={`/article/${item.slug}`}>
                      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: idx !== arr.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: idx !== arr.length - 1 ? '1rem' : '0', cursor: 'pointer' }}>
                        <div style={{ width: '80px', height: '60px', backgroundColor: '#e5e7eb', borderRadius: '4px', flexShrink: 0, overflow: 'hidden' }}>
                          {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.3' }}>{item.title}</h4>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ height: '250px', backgroundColor: '#f3f4f6', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
              Advertisement
            </div>

            {/* Newsletter box */}
            <div style={{ backgroundColor: '#111827', color: 'white', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Never Miss an Update</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem' }}>Get breaking news delivered straight to your inbox.</p>
              <input type="email" placeholder="Email address" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: 'none', marginBottom: '0.5rem', outline: 'none' }} />
              <button style={{ width: '100%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Subscribe</button>
            </div>
          </aside>
        </div>

        {/* More from category */}
        <section style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>More from {article.category_name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {moreArticles.map((item: any) => (
              <Link key={item.id} href={`/article/${item.slug}`}>
                <div style={{ cursor: 'pointer' }}>
                  <div style={{ height: '160px', backgroundColor: '#e5e7eb', borderRadius: '6px', marginBottom: '0.75rem', overflow: 'hidden' }}>
                    {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.25rem' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
