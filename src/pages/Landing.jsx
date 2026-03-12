import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const portals = [
  {
    type: 'patient',
    icon: '👤',
    title: 'Patient Portal',
    subtitle: 'For Users & Patients',
    description: 'Check symptoms with AI, find specialists nearby, book appointments and track your health history.',
    features: ['AI Symptom Analysis', 'Find Nearby Hospitals', 'Book Appointments', 'Health History'],
    color: '#00c9a7',
    bg: 'rgba(0, 201, 167, 0.06)',
    border: 'rgba(0, 201, 167, 0.25)',
    route: '/patient/auth',
  },
  {
    type: 'doctor',
    icon: '🩺',
    title: 'Doctor Portal',
    subtitle: 'For Medical Professionals',
    description: 'Manage your appointments, view patient cases, accept or decline bookings and stay connected.',
    features: ['Manage Appointments', 'View Patient Details', 'Accept/Decline Slots', 'Profile Management'],
    color: '#ffd93d',
    bg: 'rgba(255, 217, 61, 0.06)',
    border: 'rgba(255, 217, 61, 0.25)',
    route: '/doctor/auth',
  },
  {
    type: 'admin',
    icon: '🛡️',
    title: 'Admin Portal',
    subtitle: 'For Administrators',
    description: 'Verify doctor licenses, manage the platform, oversee all appointments and monitor activity.',
    features: ['Verify Doctor Licenses', 'Add/Remove Doctors', 'View All Appointments', 'Platform Analytics'],
    color: '#ff6b6b',
    bg: 'rgba(255, 107, 107, 0.06)',
    border: 'rgba(255, 107, 107, 0.25)',
    route: '/admin/auth',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Background blobs */}
      <div className="bg-blob" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%)', top: -200, left: -200 }} />
      <div className="bg-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)', bottom: 0, right: -100 }} />

      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 80, animation: 'fadeInUp 0.7s ease forwards' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 28,
            fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.06em'
          }}>
            ✦ AI-POWERED HEALTHCARE PLATFORM
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Healthcare, intelligently
            <br />
            <span style={{ color: 'var(--teal)' }}>reimagined.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            AI-powered symptom analysis, specialist discovery, and real-time appointment management — all in one platform.
          </p>
        </div>

        {/* Portal Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {portals.map((portal, i) => (
            <div
              key={portal.type}
              onClick={() => navigate(portal.route)}
              className="glass-card"
              style={{
                padding: '36px',
                cursor: 'pointer',
                background: portal.bg,
                border: `1px solid ${portal.border}`,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeInUp 0.6s ease ${i * 0.12}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 60px ${portal.color}25`;
                e.currentTarget.style.borderColor = portal.color + '60';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = portal.border;
              }}
            >
              {/* Decorative corner */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80,
                background: `radial-gradient(circle at top right, ${portal.color}20, transparent)`,
                borderRadius: '0 16px 0 80px',
              }} />

              <div style={{ fontSize: 44, marginBottom: 20, lineHeight: 1 }}>{portal.icon}</div>

              <div style={{ marginBottom: 6 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                  color: portal.color, textTransform: 'uppercase',
                }}>
                  {portal.subtitle}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em' }}>
                {portal.title}
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 28 }}>
                {portal.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {portal.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: portal.color, fontWeight: 700 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: portal.color, fontSize: '0.9rem', fontWeight: 600,
              }}>
                Enter Portal
                <span style={{ transition: 'transform 0.2s' }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 60,
          marginTop: 80, paddingTop: 40,
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}>
          {[['10,000+', 'Registered Patients'], ['500+', 'Verified Doctors'], ['50+', 'Partner Hospitals'], ['98%', 'Diagnosis Accuracy']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center', animation: 'fadeIn 1s ease 0.5s both' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: 'var(--teal)', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}