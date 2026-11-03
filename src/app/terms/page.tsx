import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions (नियम और शर्तें) | Bolta Gurugram',
  description: 'Terms and Conditions for Bolta Gurugram website and mobile services.',
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', color: '#374151', lineHeight: '1.8' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-dark)', margin: '0 0 0.5rem 0' }}>
              Terms and Conditions (नियम और शर्तें)
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
              Last Updated: November 2026
            </p>
          </div>

          <p style={{ fontSize: '1.05rem' }}>
            Welcome to <strong>Bolta Gurugram</strong> (accessible at <a href="https://boltagurugram.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>https://boltagurugram.com</a>). By accessing, browsing, or using our website, digital editions, and related platforms, you accept and agree to be bound by the following Terms and Conditions.
          </p>

          <p style={{ fontSize: '1rem', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', margin: '1.5rem 0' }}>
            कृपया इस वेबसाइट का उपयोग करने से पहले इन नियमों व शर्तों को ध्यानपूर्वक पढ़ें। हमारी वेबसाइट का उपयोग करना यह दर्शाता है कि आप इन शर्तों को पूर्ण रूप से स्वीकार करते हैं।
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>

            {/* Section 1 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                1. Acceptance of Terms (शर्तों की स्वीकृति)
              </h3>
              <p style={{ margin: 0 }}>
                These terms govern your access to and use of all content, news reporting, editorial opinions, media, and features published by Bolta Gurugram. If you disagree with any part of these terms, please discontinue using our site immediately.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                2. Intellectual Property Rights (बौद्धिक संपदा अधिकार)
              </h3>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                Unless otherwise stated, Bolta Gurugram and its licensors own all intellectual property rights for the content, design, graphics, text, logos, original reporting, and photography published on this website. All intellectual property rights are reserved.
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>You may read, view, and share articles via social media for personal, non-commercial use.</li>
                <li>You may not republish, sell, rent, sub-license, duplicate, or scrape content from Bolta Gurugram without prior written consent.</li>
                <li>Fair use quotes and snippets must clearly credit <strong>Bolta Gurugram</strong> with an active hyperlink back to the original article.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                3. User Conduct and Comments (उपयोगकर्ता आचरण)
              </h3>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                When engaging with our platform or submitting tips/feedback, users agree not to post or transmit:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Defamatory, obscene, offensive, hateful, or racially/ethnically objectionable material.</li>
                <li>False, misleading, or fabricated news intended to spread rumors or incite unrest.</li>
                <li>Content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights.</li>
                <li>Spam, unauthorized advertisements, or malicious scripts.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                4. Third-Party Links & Advertisements (तृतीय-पक्ष लिंक और विज्ञापन)
              </h3>
              <p style={{ margin: 0 }}>
                Our website displays third-party advertisements (including Google AdSense) and links to external websites (such as social networks and government portals). We do not control or endorse the content, policies, or practices of third-party websites or advertisers, and accept no liability for their products or services.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                5. Accuracy & Correction Policy (सटीकता और सुधार)
              </h3>
              <p style={{ margin: 0 }}>
                While Bolta Gurugram makes every effort to ensure the accuracy and reliability of all news published, news events develop dynamically. We do not warrant that all content is free from inadvertent typographical errors or instantaneous real-time updates. If you spot an inaccuracy, please contact us for immediate editorial review under our <Link href="/editorial-policy" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Corrections Policy</Link>.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                6. Limitation of Liability (दायित्व की सीमा)
              </h3>
              <p style={{ margin: 0 }}>
                In no event shall Bolta Gurugram, its editors, reporters, directors, or affiliates be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use our website or reliance on information presented here.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                7. Governing Law and Jurisdiction (लागू कानून व क्षेत्राधिकार)
              </h3>
              <p style={{ margin: 0 }}>
                These terms shall be governed by and construed in accordance with the laws of India. Any legal dispute arising out of or related to these terms shall be subject exclusively to the jurisdiction of the competent courts in <strong>Gurugram, Haryana, India</strong>.
              </p>
            </div>

            {/* Section 8: Contact */}
            <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                Contact for Legal Inquiries
              </h3>
              <p style={{ margin: '0 0 1rem 0' }}>
                For any questions regarding these Terms & Conditions, please write to:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '1rem' }}>
                <div>📧 <strong>Email:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)' }}>boltagurugram@gmail.com</a></div>
                <div>📍 <strong>Address:</strong> Kamla Palace, Sohna Chowk, Gurugram, Haryana 122001, India</div>
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

