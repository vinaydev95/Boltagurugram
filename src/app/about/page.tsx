import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Bolta Gurugram',
  description: 'गुरुग्राम और हरियाणा की सबसे विश्वसनीय डिजिटल हिंदी न्यूज़ वेबसाइट।',
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '2rem' }}>
            <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Introduction
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '1rem', marginBottom: '0.5rem' }}>
              About Us
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '600', margin: 0 }}>
              हमारे बारे में | About Bolta Gurugram
            </p>
          </div>

          {/* Section 1: Intro */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#374151', fontWeight: '500' }}>
              <strong>Bolta Gurugram</strong> गुरुग्राम और हरियाणा की सबसे विश्वसनीय डिजिटल हिंदी न्यूज़ वेबसाइट है।
              हम गुरुग्राम के हर नागरिक तक सच्ची, निष्पक्ष और तेज़ खबरें पहुँचाने के लिए प्रतिबद्ध हैं – बिना किसी राजनीतिक या व्यावसायिक दबाव के।
            </p>
          </div>

          {/* Section 2: Mission */}
          <div style={{ marginBottom: '2.5rem', backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
              हमारा मिशन | Our Mission
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', marginBottom: '1rem' }}>
              गुरुग्राम देश के सबसे तेज़ी से बदलते शहरों में से एक है। नई सड़कें, नए प्रोजेक्ट्स, राजनीतिक हलचल, अपराध, व्यापार – हर दिन यहाँ कुछ नया होता है।
              <strong> Bolta Gurugram</strong> का मिशन है – इस शहर की हर अहम खबर को सबसे पहले, सबसे सटीक तरीके से आप तक पहुँचाना।
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', fontStyle: 'italic', margin: 0 }}>
              We believe that an informed citizen is an empowered citizen. Our mission is to deliver accurate, fast, and unbiased local news to every resident of Gurugram and Haryana – in Hindi, the language of our people.
            </p>
          </div>

          {/* Section 3: What We Cover */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1.2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              हम क्या कवर करते हैं | What We Cover
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🏙️', title: 'गुरुग्राम न्यूज़', desc: 'शहर की ताज़ा खबरें, नगर निगम, ट्रैफिक, विकास' },
                { icon: '🌾', title: 'हरियाणा न्यूज़', desc: 'राज्य सरकार, नीतियाँ, सरकारी योजनाएँ' },
                { icon: '⚖️', title: 'राजनीति', desc: 'स्थानीय और राष्ट्रीय राजनीतिक घटनाक्रम' },
                { icon: '🚨', title: 'क्राइम न्यूज़', desc: 'साइबर क्राइम, पुलिस रिपोर्ट, कानून व्यवस्था' },
                { icon: '💼', title: 'बिज़नेस न्यूज़', desc: 'सोना-चांदी भाव, बाज़ार, स्थानीय व्यापार' },
                { icon: '🔥', title: 'वायरल', desc: 'सोशल मीडिया, ट्रेंडिंग स्टोरीज़' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>{item.icon}</span>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Team */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              हमारी टीम | Our Team
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', marginBottom: '1rem' }}>
              <strong>Bolta Gurugram</strong> की टीम में अनुभवी पत्रकार, स्थानीय रिपोर्टर और डिजिटल मीडिया विशेषज्ञ शामिल हैं जो गुरुग्राम और हरियाणा की जमीनी खबरों से जुड़े हैं।
              हमारी संपादकीय नीति पूरी तरह स्वतंत्र है। हम किसी भी राजनीतिक दल, कॉर्पोरेट संस्था या बाहरी दबाव के अधीन नहीं हैं।
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', fontStyle: 'italic', margin: 0 }}>
              Our editorial team comprises experienced journalists and local reporters deeply rooted in the Gurugram and Haryana region. Every story published on Bolta Gurugram goes through an editorial review process to ensure accuracy and fairness.
            </p>
          </div>

          {/* Section 5: Story */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              हमारी स्थापना | Our Story
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', marginBottom: '1rem' }}>
              <strong>Bolta Gurugram</strong> की स्थापना इस विश्वास के साथ की गई कि गुरुग्राम के लोगों को एक भरोसेमंद, स्थानीय और हिंदी भाषा का डिजिटल न्यूज़ प्लेटफॉर्म मिलना चाहिए।
              आज हम हरियाणा के सबसे तेज़ी से बढ़ते हिंदी न्यूज़ पोर्टल्स में से एक हैं – रोज़ाना हज़ारों पाठकों तक पहुँचते हैं।
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', fontStyle: 'italic', margin: 0 }}>
              Bolta Gurugram was founded with a single belief: the people of Gurugram deserve a trusted, local, Hindi-language digital news platform that puts their stories first. Today, we are one of Haryana’s fastest-growing Hindi news portals, reaching thousands of readers daily.
            </p>
          </div>

          {/* Section 6: Contact */}
          <div style={{ marginBottom: '2.5rem', padding: '2rem', border: '1px dashed var(--primary-color)', borderRadius: '8px', backgroundColor: '#fffdfd' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              संपर्क करें | Contact Us
            </h2>
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem' }}>
              हमसे किसी भी खबर, सुझाव, विज्ञापन या शिकायत के लिए संपर्क करें:<br />
              <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>For news tips, feedback, advertising inquiries, or corrections, reach out to us:</span>
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem' }}>
              <div>📧 <strong>Email:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)' }}>boltagurugram@gmail.com</a></div>
              <div>📍 <strong>Location:</strong> Gurugram, Haryana, India</div>
              <div>🌐 <strong>Website:</strong> <a href="https://www.boltagurugram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>www.boltagurugram.com</a></div>
              <div style={{ marginTop: '0.5rem' }}>
                📱 <strong>WhatsApp News Tips:</strong><br />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <a href="https://wa.me/919899345464" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>WhatsApp Chat 1</a>
                  <a href="https://wa.me/918010878256" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>WhatsApp Chat 2</a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Advertise */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              विज्ञापन | Advertise With Us
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563' }}>
              क्या आप गुरुग्राम और हरियाणा के पाठकों तक पहुँचना चाहते हैं? हमारे प्लेटफॉर्म पर विज्ञापन दें और अपने व्यवसाय को नई ऊँचाइयों पर ले जाएँ।<br />
              <span style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>Want to reach thousands of readers across Gurugram and Haryana? Advertise with Bolta Gurugram.</span>
            </p>
            <p style={{ fontSize: '1.05rem' }}>
              📧 <strong>Advertising enquiries:</strong> <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)' }}>boltagurugram@gmail.com</a>
            </p>
          </div>

          {/* Section 8: Follow Us */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              हमें फॉलो करें | Follow Us
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <a href="https://www.facebook.com/share/1D3Z7etPtB/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1877F2', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Facebook</a>
              <a href="https://www.instagram.com/boltagurugram?utm_source=qr&igsh=cXhtYmt2ZGx2MG5m" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#E1306C', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Instagram</a>
              <a href="https://x.com/BoltaGurugram" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#000000', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Twitter / X</a>
              <a href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF0000', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>YouTube</a>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-light)', fontSize: '0.9rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <strong>Bolta Gurugram</strong> – गुरुग्राम की आवाज़ | The Voice of Gurugram
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
