import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial & Grievance Policy (संपादकीय एवं सुधार नीति) | Bolta Gurugram',
  description: 'Editorial standards, fact-checking policy, corrections policy, and grievance redressal mechanism for Bolta Gurugram news portal under Indian IT Rules 2021.',
};

export default function EditorialPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', color: '#374151', lineHeight: '1.8' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Journalistic Standards
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-dark)', margin: '1rem 0 0.5rem 0' }}>
              Editorial & Grievance Policy
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
              संपादकीय, तथ्य-जांच, सुधार नीति एवं शिकायत निवारण प्रणाली | Compliance with Digital Media Ethics Code (IT Rules, 2021)
            </p>
          </div>

          <p style={{ fontSize: '1.05rem' }}>
            <strong>Bolta Gurugram</strong> is committed to truthful, fair, independent, and ethical journalism. Our primary responsibility is to our readers across Gurugram, Haryana, and the National Capital Region (NCR). We operate with full editorial independence, without political affiliation or corporate influence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>

            {/* Section 1: Editorial Independence */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.35rem', display: 'inline-block' }}>
                1. Editorial Independence & Standards (संपादकीय स्वतंत्रता)
              </h2>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                Our editorial team maintains complete independence in news gathering, story selection, and reporting. Advertisers, commercial partners, and outside interests have zero influence over our news decisions.
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li><strong>No Paid Editorial:</strong> We do not publish news articles or favourable editorial coverage in exchange for payment. Sponsored articles, if any, are clearly labeled as &quot;Sponsored&quot; or &quot;Advertisement&quot;.</li>
                <li><strong>Impartiality:</strong> We report facts as they are, without sensationalism or communal bias. In controversial matters, all primary perspectives and official statements are sought and recorded.</li>
                <li><strong>Public Interest:</strong> Our reporting focuses on civic accountability, citizen welfare, law and order, urban development, education, and social harmony.</li>
              </ul>
            </div>

            {/* Section 2: Fact-Checking */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.35rem', display: 'inline-block' }}>
                2. Fact-Checking Policy (तथ्य-जांच नीति)
              </h2>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                Accuracy is the cornerstone of Bolta Gurugram. Every report published on our portal goes through rigorous verification:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li><strong>Primary Sourcing:</strong> Whenever possible, information is obtained directly from primary sources – police FIRs, court orders, government notifications, official spokespersons, or eyewitnesses.</li>
                <li><strong>Cross-Verification:</strong> Information received via social media, tipsters, or unverified channels is cross-checked with at least two independent sources or official authorities before publication.</li>
                <li><strong>Clear Attribution:</strong> Sources of quotes, statistical data, and reference materials are explicitly credited within the article.</li>
              </ul>
            </div>

            {/* Section 3: Corrections Policy */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.35rem', display: 'inline-block' }}>
                3. Corrections Policy (सुधार नीति)
              </h2>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                We acknowledge our mistakes promptly and transparently:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>If a factual error is brought to our attention and confirmed, the article is corrected immediately.</li>
                <li>Significant factual corrections carry a clear &quot;Correction Note&quot; or &quot;Updated&quot; timestamp explaining the change.</li>
                <li>Readers may report inaccuracies at any time by emailing <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>boltagurugram@gmail.com</a> with the subject line <em>&quot;Correction Request: [Article Title]&quot;</em>.</li>
              </ul>
            </div>

            {/* Section 4: Ethics Code */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.35rem', display: 'inline-block' }}>
                4. Code of Ethics (पत्रकारिता आचार संहिता)
              </h2>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li><strong>Protection of Minors & Victims:</strong> In accordance with Indian laws (including POCSO Act and Section 228A IPC), we strictly protect the identities of minor victims, sexual assault survivors, and juvenile offenders.</li>
                <li><strong>No Hate Speech:</strong> We strictly prohibit content inciting violence, religious disharmony, communal tension, or national security harm.</li>
                <li><strong>Right of Reply:</strong> Any individual or entity that is the subject of critical investigative reporting has the right to provide their side of the story.</li>
              </ul>
            </div>

            {/* Section 5: Grievance Redressal (Mandatory under IT Rules 2021) */}
            <div style={{ backgroundColor: '#fff7ed', padding: '2rem', borderRadius: '8px', border: '2px solid #fdba74' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#9a3412', marginBottom: '0.75rem' }}>
                5. Grievance Redressal Mechanism (शिकायत निवारण प्रणाली)
              </h2>
              <p style={{ margin: '0 0 1rem 0', color: '#7c2d12', fontSize: '0.95rem' }}>
                In compliance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong> issued by the Ministry of Information and Broadcasting, Government of India, Bolta Gurugram has appointed a Grievance Officer to address reader complaints:
              </p>
              
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '6px', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                <div>👤 <strong>Grievance Officer:</strong> Sahil Manchanda</div>
                <div>🏢 <strong>Designation:</strong> Editor & Grievance Redressal Officer</div>
                <div>📧 <strong>Grievance Email:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>boltagurugram@gmail.com</a></div>
                <div>📞 <strong>Contact Phone:</strong> +91 9899345464</div>
                <div>📍 <strong>Address for Grievance Correspondence:</strong> Kamla Palace, Sohna Chowk, Gurugram, Haryana 122001, India</div>
                <div>⏱️ <strong>Resolution Timeframe:</strong> Acknowledgement within 24 hours; decision within 15 days as mandated by IT Rules 2021.</div>
              </div>
            </div>

            {/* Section 6: Editorial Team */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.35rem', display: 'inline-block' }}>
                6. Editorial Leadership (संपादकीय नेतृत्व)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)', fontSize: '1.1rem' }}>Sahil Manchanda</h4>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Editor-in-Chief & Lead Reporter</p>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
                    Over 5 years of local reporting experience covering Gurugram administration, civic issues, police beat, and Haryana political developments.
                  </p>
                </div>
                <div style={{ padding: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)', fontSize: '1.1rem' }}>Editorial Desk</h4>
                  <p style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Desk Editors & Digital Content Team</p>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
                    Dedicated team verifying breaking news, city updates, social interest stories, and community developments across Haryana.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '4rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
            <strong>Bolta Gurugram</strong> – गुरुग्राम की आवाज़ | The Voice of Gurugram
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}

