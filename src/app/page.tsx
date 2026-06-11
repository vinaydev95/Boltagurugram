import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getLatestArticlesDB, getTrendingArticlesDB, getArticlesByCategoryDB } from '@/lib/db-queries';

// Force dynamic rendering so data is always fresh
export const dynamic = 'force-dynamic';

export default async function Home() {
  const latest = await getLatestArticlesDB(14);
  const trending = await getTrendingArticlesDB(5);
  const sportsArticles = await getArticlesByCategoryDB('sports', 4);
  const crimeArticles = await getArticlesByCategoryDB('crime', 4);
  const politicalArticles = await getArticlesByCategoryDB('political', 4);

  const heroArticle = latest[0];
  const secondaryArticles = latest.slice(1, 3);

  if (!heroArticle) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem', flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>No Articles Yet</h1>
          <p style={{ color: 'var(--text-light)' }}>Articles will appear here once published from the dashboard.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>

        {/* Top Grid: Hero Section + Side Trending */}
        <div className="grid-hero">

          {/* Main Hero Story */}
          <section>
            <Link href={`/article/${heroArticle.slug}`}>
              <div className="hero-section" style={{ backgroundImage: heroArticle.image_url ? `url(${heroArticle.image_url})` : 'none' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' }}>
                  <span style={{ backgroundColor: 'var(--primary-color)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>{heroArticle.category_name} Breaking</span>
                  <h2 className="hero-title">{heroArticle.title}</h2>
                  <p style={{ fontSize: '1.1rem', color: '#d1d5db', marginBottom: '1rem' }}>{heroArticle.excerpt}</p>
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>By {heroArticle.author} • {heroArticle.date}</span>
                </div>
              </div>
            </Link>

            {/* Secondary Hero Stories */}
            <div className="grid-2col">
              {secondaryArticles.map((article: any) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', gap: '1rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <div style={{ width: '100px', height: '100px', backgroundColor: '#e5e7eb', borderRadius: '4px', flexShrink: 0, overflow: 'hidden' }}>
                      {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{article.category_name}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0.25rem 0 0.5rem 0', lineHeight: '1.3' }}>{article.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Right Sidebar - Trending */}
          <aside style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase' }}>Trending Now</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', marginLeft: '0.5rem', animation: 'pulse 2s infinite' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trending.map((article: any, index: number) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: index !== trending.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#e5e7eb', lineHeight: '1' }}>0{index + 1}</span>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', lineHeight: '1.4', marginBottom: '0.25rem' }}>{article.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{article.viewsFormatted} Views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: '2rem', height: '250px', backgroundColor: '#f3f4f6', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
              Advertisement Space
            </div>
          </aside>
        </div>

        {/* Latest News Grid */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>LATEST NEWS</h3>
          <div className="grid-4col">
            {latest.slice(3, 7).map((article: any) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                  <div style={{ height: '160px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <span style={{ color: 'var(--primary-color)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{article.category_name}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem', marginTop: '0.25rem' }}>{article.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* Sports Section */}
          <section>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              SPORTS
              <Link href="/category/sports"><span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--primary-color)', cursor: 'pointer' }}>View All →</span></Link>
            </h3>
            <div className="grid-4col">
              {(sportsArticles.length > 0 ? sportsArticles : latest.slice(0, 4)).map((article: any) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <div style={{ height: '160px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem' }}>{article.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Crime Section */}
          <section>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              CRIME
              <Link href="/category/crime"><span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--primary-color)', cursor: 'pointer' }}>View All →</span></Link>
            </h3>
            <div className="grid-4col">
              {(crimeArticles.length > 0 ? crimeArticles : latest.slice(0, 4)).map((article: any) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <div style={{ height: '160px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem' }}>{article.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Political Section */}
          <section>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid var(--text-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              POLITICAL
              <Link href="/category/political"><span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--primary-color)', cursor: 'pointer' }}>View All →</span></Link>
            </h3>
            <div className="grid-4col">
              {(politicalArticles.length > 0 ? politicalArticles : latest.slice(0, 4)).map((article: any) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <div style={{ height: '160px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem' }}>{article.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
