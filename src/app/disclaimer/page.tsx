import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer (अस्वीकरण) | Bolta Gurugram',
  description: 'Legal disclaimer and content policy for Bolta Gurugram news portal.',
};

export default function DisclaimerPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', color: '#374151', lineHeight: '1.8' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-dark)', margin: '0 0 0.5rem 0' }}>
              Disclaimer (अस्वीकरण)
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
              Last Updated: November 2026
            </p>
          </div>

          <p style={{ fontSize: '1.05rem' }}>
            The information provided on <strong>Bolta Gurugram</strong> (website: <a href="https://boltagurugram.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>https://boltagurugram.com</a>) is for general news, informational, and educational purposes only.
          </p>

          <p style={{ fontSize: '1rem', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', margin: '1.5rem 0' }}>
            <strong>बोलता गुरुग्राम (Bolta Gurugram)</strong> पर प्रकाशित सभी समाचार, विश्लेषण और सूचनाएं जनहित, तथ्यपरक पत्रकारिता और निष्पक्ष रिपोर्टिंग के उद्देश्य से प्रस्तुत की जाती हैं।
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>

            {/* Section 1 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                1. News Reporting and Verification (समाचार रिपोर्टिंग एवं सत्यापन)
              </h3>
              <p style={{ margin: 0 }}>
                All news stories, crime reports, administrative developments, and political updates published on Bolta Gurugram are gathered through ground reporting, official police press releases, government bulletins, eyewitness interviews, and accredited news agencies. While our editorial team takes all reasonable precautions to cross-verify facts before publication, breaking news events develop rapidly and updates are issued as verified facts emerge.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                2. Fair Use Disclaimer (भारतीय कॉपीराइट कानून के तहत उचित उपयोग)
              </h3>
              <p style={{ margin: 0 }}>
                This website may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. Such material is made available in accordance with <strong>Section 52 of the Indian Copyright Act, 1957</strong> (Fair Dealing for the purpose of reporting current events, review, criticism, or education). Full credit and attribution are given to respective sources.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                3. Views and Opinions Expressed (विचार एवं राय)
              </h3>
              <p style={{ margin: 0 }}>
                Articles, columns, opinion pieces, or interviews attributed to specific authors, columnists, or public figures express their personal viewpoints. They do not necessarily reflect the official stance, policy, or editorial viewpoint of Bolta Gurugram or its publisher.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                4. External Links and Advertisements (विज्ञापन एवं बाहरी लिंक)
              </h3>
              <p style={{ margin: 0 }}>
                Bolta Gurugram displays advertisements through Google AdSense and third-party advertising networks. We do not manufacture, sell, guarantee, or endorse any products or services advertised on our portal. Users are advised to exercise their own discretion and due diligence before making purchasing decisions based on third-party ads or clicking outbound links.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                5. Professional Advice Disclaimer (पेशेवर सलाह अस्वीकरण)
              </h3>
              <p style={{ margin: 0 }}>
                Content published on this website regarding market rates (e.g. gold, silver, real estate), legal developments, government schemes, or health news is provided for general awareness. It does not constitute formal legal, financial, investment, or medical advice.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                6. Corrections and Content Removal Requests (सुधार एवं निष्कासन अनुरोध)
              </h3>
              <p style={{ margin: 0 }}>
                We believe in transparent, accountable journalism. If any party finds factual inaccuracies or has legitimate concerns regarding any published article, photograph, or attribution, please notify our editorial desk immediately. We review and resolve legitimate complaints expeditiously in accordance with our <Link href="/editorial-policy" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Editorial Policy</Link>.
              </p>
            </div>

            {/* Contact Card */}
            <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                Editorial & Legal Contact (संपादकीय संपर्क)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '1rem' }}>
                <div>📧 <strong>Editorial Desk:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)' }}>boltagurugram@gmail.com</a></div>
                <div>📍 <strong>Registered Office:</strong> Kamla Palace, Sohna Chowk, Gurugram, Haryana 122001, India</div>
                <div>📞 <strong>Phone:</strong> +91 9899345464</div>
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

