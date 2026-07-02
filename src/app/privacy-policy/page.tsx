import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bolta Gurugram',
  description: 'Privacy Policy for Bolta Gurugram website and Android application.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', color: '#374151', lineHeight: '1.8' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-dark)', margin: '0 0 0.5rem 0' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
              Last Updated: July 2026
            </p>
          </div>

          {/* Intro */}
          <p style={{ fontSize: '1.05rem' }}>
            <strong>Bolta Gurugram</strong>, accessible from <a href="https://www.boltagurugram.com/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>https://www.boltagurugram.com/</a>, and our official Android application (Bolta Gurugram App) respect your privacy and are committed to protecting any personal data shared with us.
          </p>

          <p style={{ fontSize: '1.05rem', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', margin: '1.5rem 0' }}>
            यह Privacy Policy उन सभी उपयोगकर्ताओं पर लागू होती है जो हमारी वेबसाइट, ऐप, सोशल मीडिया चैनलों, या किसी भी अन्य डिजिटल प्लेटफ़ॉर्म पर विज़िट करते हैं।
          </p>

          <p>
            यदि आपको इस नीति से संबंधित कोई सवाल हो, तो कृपया संपर्क करें:<br />
            📧 <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>boltagurugram@gmail.com</a>
          </p>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
            
            {/* Section 1 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 1. आपकी सहमति (Your Consent)
              </h3>
              <p style={{ margin: 0 }}>
                हमारी वेबसाइट/ऐप का उपयोग करके, आप हमारी Privacy Policy और उसकी शर्तों से सहमत होते हैं।
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 2. हम कौन-सी जानकारी एकत्र करते हैं (Information We Collect)
              </h3>
              <p style={{ marginBottom: '1rem' }}>हम निम्न दो प्रकार की जानकारी एकत्र करते हैं:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--text-dark)' }}>A) जानकारी जो आप स्वयं प्रदान करते हैं (Information You Provide Directly):</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li>नाम (Name)</li>
                    <li>ईमेल पता (Email address)</li>
                    <li>फ़ोन नंबर (Phone number - यदि प्रदान किया गया हो)</li>
                    <li>संदेश की सामग्री (Contact form, Email आदि के माध्यम से)</li>
                    <li>खाते की जानकारी (यदि आप ऐप/वेबसाइट पर अकाउंट बनाते हैं)</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--text-dark)' }}>B) स्वतः संग्रहित जानकारी (Information Collected Automatically):</h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>हमारी वेबसाइट मानक लॉग फ़ाइलों और एनालिटिक्स टूल्स का उपयोग करती है। इनमें शामिल हैं:</p>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device type</li>
                    <li>ISP</li>
                    <li>Date & time stamp</li>
                    <li>Referring/exit pages</li>
                    <li>क्लिक और यूज़र इंटरैक्शन (Clicks and user interaction)</li>
                    <li>Cookies & Web Beacons</li>
                    <li>Approximate location (App & Analytics के माध्यम से)</li>
                  </ul>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                    यह जानकारी व्यक्तिगत पहचान से जुड़ी नहीं होती।
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 3. मोबाइल ऐप द्वारा एकत्रित डेटा (App-Specific Data Collection)
              </h3>
              <p style={{ marginBottom: '1rem' }}>हमारे Play Store App में कुछ डेटा स्वतः एकत्र किया जा सकता है:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>A) Device Information</h4>
                  <p style={{ margin: 0 }}>Device ID (anonymized), Operating system, Crash logs (Firebase Crashlytics)</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>B) Advertising & Analytics Data</h4>
                  <p style={{ margin: 0 }}>Google AdMob (Ads personalization), Firebase Analytics (App usage insights)</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>C) Notifications</h4>
                  <p style={{ margin: 0 }}>यदि आप अनुमति देते हैं, तो ऐप Push Notifications भेज सकता है (Breaking News, Alerts आदि).</p>
                </div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                हम कोई भी संवेदनशील डेटा (जैसे contact list, photos, SMS, biometric, exact location) एकत्र नहीं करते।
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 4. हम आपकी जानकारी का कैसे उपयोग करते हैं (How We Use Your Information)
              </h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>हम आपकी जानकारी का उपयोग इन उद्देश्यों के लिए करते हैं:</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>हमारी वेबसाइट/ऐप को चलाने और सुधारने के लिए</li>
                <li>यूज़र अनुभव को पर्सनलाइज़ करने के लिए</li>
                <li>सामग्री में सुधार करने के लिए</li>
                <li>Customer support और feedback के लिए</li>
                <li>News updates, notifications और alerts भेजने के लिए</li>
                <li>Fraud / security issues को रोकने के लिए</li>
                <li>AdSense और AdMob विज्ञापनों को बेहतर बनाने के लिए</li>
                <li>Google Analytics/Firebase के माध्यम से ऐप/वेबसाइट performance समझने के लिए</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 5. Cookies & Tracking Technologies
              </h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>हमारी वेबसाइट निम्न Cookies का उपयोग करती है:</p>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
                <li>Google Analytics Cookies</li>
                <li>Google AdSense (DART Cookies)</li>
                <li>AdMob App Cookies</li>
                <li>Functional Cookies</li>
                <li>Performance Cookies</li>
              </ul>
              <p style={{ margin: '0 0 1rem 0' }}>आप ब्राउज़र/डिवाइस सेटिंग्स से Cookies को disable कर सकते हैं।</p>
              <p style={{ margin: 0 }}>
                Google Ads privacy policy: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>https://policies.google.com/technologies/ads</a>
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 6. Google AdSense, AdMob & Third-Party Advertisers
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>हमारी वेबसाइट और ऐप निम्न third-party technologies उपयोग कर सकते हैं:</p>
              <p style={{ fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>Google AdSense, Google AdMob, Google DoubleClick, Google Marketing Platform, Facebook Audience Network (यदि भविष्य में लागू हो)</p>
              <p style={{ margin: '0 0 0.5rem 0' }}>ये विज्ञापनदाता Cookies, JavaScript, या Web Beacons का उपयोग कर सकते हैं।</p>
              <p style={{ fontWeight: 'bold', margin: 0 }}>हमारे पास third-party cookies पर कोई नियंत्रण नहीं है।</p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 7. External Links Disclaimer
              </h3>
              <p style={{ margin: 0 }}>
                हमारी वेबसाइट में बाहरी साइट्स के लिंक होते हैं (YouTube, WhatsApp, Facebook, Play Store आदि)। इन साइटों की सुरक्षा, कंटेंट या डेटा collection policies पर हमारा कोई नियंत्रण नहीं है।
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 8. Data Retention (डेटा कितने समय तक रखा जाता है)
              </h3>
              <p style={{ margin: 0 }}>
                हम डेटा केवल उतने समय तक रखते हैं जितना कि कानूनी आवश्यकता, ग्राहक सहायता, वेबसाइट/ऐप सुधार और विश्लेषणात्मक उद्देश्यों के लिए आवश्यक हो।
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 9. Data Security (डेटा सुरक्षा)
              </h3>
              <p style={{ margin: 0 }}>
                हम HTTPS encryption, Firewall & Malware protection, Access-control systems और App-level data encryption (Firebase standards) जैसी सुरक्षा अपनाते हैं। हालांकि कोई भी तरीका 100% सुरक्षित नहीं है, पर हम सर्वोत्तम प्रयास करते हैं।
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 10. Your Data Protection Rights (GDPR/India Rights)
              </h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>हर यूज़र को निम्न अधिकार हैं:</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>व्यक्तिगत डेटा तक पहुंच (Access)</li>
                <li>गलत डेटा को सुधारना (Rectification)</li>
                <li>डेटा हटाने का अनुरोध (Erasure)</li>
                <li>प्रोसेसिंग सीमित करने का अधिकार (Restrict Processing)</li>
                <li>डेटा पोर्टेबिलिटी (Data Portability)</li>
                <li>प्रोसेसिंग का विरोध करने का अधिकार (Object to Processing)</li>
              </ul>
              <p style={{ marginTop: '0.5rem', margin: 0 }}>हम आपके अनुरोध का 30 दिनों के भीतर जवाब देंगे।</p>
            </div>

            {/* Section 11 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 11. CCPA (California Privacy Rights)
              </h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>California consumers को निम्न अधिकार प्राप्त होते हैं:</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>कौन-सा डेटा एकत्र किया गया है → जानने का अधिकार</li>
                <li>डेटा हटाने का अधिकार</li>
                <li>“Do Not Sell My Information” का विकल्प</li>
              </ul>
              <p style={{ marginTop: '0.5rem', margin: 0, fontStyle: 'italic' }}>
                (हम व्यक्तिगत डेटा बेचते नहीं हैं)
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                🔹 12. Children’s Privacy
              </h3>
              <p style={{ margin: 0 }}>
                हम 13 वर्ष से कम आयु के बच्चों से जानबूझकर कोई व्यक्तिगत जानकारी एकत्र नहीं करते। अगर आपको लगता है कि आपके बच्चे ने जानकारी दी है, तो हमें तुरंत संपर्क करें — हम उसे हटा देंगे।
              </p>
            </div>

            {/* Section 13 */}
            <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                🔹 13. Contact Information (संपर्क जानकारी)
              </h3>
              <p style={{ margin: '0 0 1.25rem 0' }}>
                यदि आपको इस Privacy Policy से संबंधित कोई प्रश्न हो, तो संपर्क करें:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem' }}>
                <div>📧 <strong>Email:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)' }}>boltagurugram@gmail.com</a></div>
                <div>📞 <strong>Phone:</strong> +91 9899345464</div>
                <div>📍 <strong>Address:</strong> Kamla Palace, Sohna Chowk, Gurugram, Haryana 122001</div>
                <div>💬 <strong>WhatsApp Channel:</strong> <a href="https://whatsapp.com/channel/0029Va5hI9s47XeI8YoEeU11" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Channel Link</a></div>
                <div>▶️ <strong>YouTube:</strong> <a href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>YouTube Link</a></div>
                <div>📲 <strong>Play Store App:</strong> <a href="https://play.google.com/store/apps/details?id=com.gnn&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>App Download</a></div>
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
