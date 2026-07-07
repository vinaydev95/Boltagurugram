import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getArticleBySlugDB, getRelatedArticlesDB, getLatestArticlesDB, incrementArticleViewsDB } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const article = await getArticleBySlugDB(decodedSlug);
  const title = article?.title || decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const desc = article?.excerpt || `Read the latest news about ${title}.`;
  
  // Resolve article image or fallback to brand logo
  const shareImage = article?.image_url || 'https://boltagurugram.com/logo.gif';

  return {
    title: `${title} | Bolta Gurugram`,
    description: desc,
    openGraph: {
      title: `${title} | Bolta Gurugram`,
      description: desc,
      type: 'article',
      url: `https://boltagurugram.com/article/${decodedSlug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Bolta Gurugram`,
      description: desc,
      images: [shareImage],
    }
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const article = await getArticleBySlugDB(decodedSlug);

  if (!article) {
    const title = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
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

  // Increment views only here in the page component
  await incrementArticleViewsDB(decodedSlug);

  const related = await getRelatedArticlesDB(article.slug, article.category_id, 4);
  const moreArticles = (await getLatestArticlesDB(5)).filter((a: any) => a.slug !== article.slug).slice(0, 4);
  const catSlug = article.category_slug || article.category_name?.toLowerCase();
  const tags = article.tagsArray || [];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/category/${catSlug}`}>{article.category_name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-dark)' }}>{article.title}</span>
        </div>

        <div className="grid-article">

          {/* Main Article Content */}
          <article style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

            <Link href={`/category/${catSlug}`}>
              <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block', cursor: 'pointer' }}>{article.category_name}</span>
            </Link>

            <h1 className="article-title">{article.title}</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-light)', flexShrink: 0 }}>{article.author?.split(' ').map((n: string) => n[0]).join('')}</div>
                <div>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{article.author}</p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>Published on {article.date} • {article.read_time} read</p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {/* Facebook Share */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://boltagurugram.com/article/${article.slug}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Share on Facebook"
                  className="share-btn"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1877F2', 
                    color: 'white', 
                    textDecoration: 'none'
                  }}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>

                {/* Twitter Share */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=https://boltagurugram.com/article/${article.slug}&text=${encodeURIComponent(article.title)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Share on X (Twitter)"
                  className="share-btn"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#000000', 
                    color: 'white', 
                    textDecoration: 'none'
                  }}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="14" height="14">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* WhatsApp Share */}
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' - https://boltagurugram.com/article/' + article.slug)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Share on WhatsApp"
                  className="share-btn"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    textDecoration: 'none'
                  }}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.578 3.88 14.102 2.855 11.5 2.853c-5.438 0-9.863 4.37-9.867 9.8-.001 2.128.561 4.21 1.63 6.026l-.991 3.623 3.734-.949z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Featured Image */}
            <div className="article-featured-img">
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
              <input type="email" placeholder="Email address" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: 'none', marginBottom: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Subscribe</button>
            </div>
          </aside>
        </div>

        {/* More from category */}
        <section style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>More from {article.category_name}</h3>
          <div className="grid-4col">
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
