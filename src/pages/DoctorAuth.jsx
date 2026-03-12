import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const qualifications = ['MBBS', 'MBBS, MD', 'MBBS, MS', 'MBBS, DM', 'MBBS, MCh', 'BDS', 'BAMS', 'BHMS'];
const specialties = ['Cardiology', 'Gastroenterology', 'Neurology', 'Pulmonology', 'Dermatology', 'Orthopedics', 'Urology', 'Endocrinology', 'Psychiatry', 'Infectious Disease', 'General Medicine', 'Pediatrics', 'Gynecology'];

export default function DoctorAuth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', qualification: '', specialty: '', licenseNo: '', hospital: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { login, addDoctor } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (tab === 'signup') {
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit number required';
      if (!form.qualification) e.qualification = 'Select qualification';
      if (!form.specialty) e.specialty = 'Select specialty';
      if (!form.licenseNo.trim()) e.licenseNo = 'License number required';
      if (!form.hospital.trim()) e.hospital = 'Hospital name required';
    }
    if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      if (tab === 'signup') {
        addDoctor({ name: form.name, email: form.email, phone: form.phone, qualification: form.qualification, specialty: form.specialty, licenseNo: form.licenseNo, hospital: form.hospital });
        setSubmitted(true);
      } else {
        login('doctor', { id: 'D001', name: form.name || 'Dr. Demo', email: form.email, specialty: 'General Medicine' });
        navigate('/doctor/dashboard');
      }
      setLoading(false);
    }, 1200);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: '' })); };

  if (submitted) return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1, position: 'relative' }}>
        <div className="glass-card" style={{ maxWidth: 440, width: '100%', padding: 48, textAlign: 'center', border: '1px solid rgba(255,217,61,0.3)', animation: 'fadeInUp 0.5s ease forwards' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⏳</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 12 }}>Application Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Your registration has been submitted successfully. An admin will verify your license number and activate your account. You'll receive a confirmation email at <strong>{form.email}</strong>.
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, transparent 70%)', top: -100, left: -150 }} />
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 480, animation: 'fadeInUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
            ← Back to Home
          </button>

          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(255,217,61,0.2)' }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🩺</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 6 }}>Doctor Portal</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {tab === 'login' ? 'Sign in to manage your appointments.' : 'Register as a doctor on MediRush.'}
              </p>
            </div>

            <div className="tabs" style={{ marginBottom: 28 }}>
              <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrors({}); }} style={tab === 'login' ? { background: '#ffd93d', color: 'var(--navy)' } : {}}>Sign In</button>
              <button className={`tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setErrors({}); }} style={tab === 'signup' ? { background: '#ffd93d', color: 'var(--navy)' } : {}}>Register</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Full Name with Title</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Priya Sharma" />
                {errors.name && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="doctor@hospital.com" />
                {errors.email && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.email}</span>}
              </div>

              {tab === 'signup' && (
                <>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
                    {errors.phone && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.phone}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label>Qualification</label>
                      <select value={form.qualification} onChange={e => set('qualification', e.target.value)}>
                        <option value="">Select</option>
                        {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      {errors.qualification && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.qualification}</span>}
                    </div>

                    <div className="form-group">
                      <label>Specialty</label>
                      <select value={form.specialty} onChange={e => set('specialty', e.target.value)}>
                        <option value="">Select</option>
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.specialty && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.specialty}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Medical License Number</label>
                    <input value={form.licenseNo} onChange={e => set('licenseNo', e.target.value)} placeholder="e.g. MH-2020-45678" style={{ fontFamily: "'JetBrains Mono', monospace" }} />
                    {errors.licenseNo && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.licenseNo}</span>}
                  </div>

                  <div className="form-group">
                    <label>Currently Working Hospital</label>
                    <input value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Apollo Hospitals, Hyderabad" />
                    {errors.hospital && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.hospital}</span>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
                {errors.password && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.password}</span>}
              </div>

              {tab === 'signup' && (
                <div style={{ background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.2)', borderRadius: 8, padding: 12, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  ℹ️ Your registration will be reviewed by an admin who will verify your license number before activation.
                </div>
              )}

              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8, padding: '14px', fontSize: '0.95rem', width: '100%', background: 'linear-gradient(135deg, #ffd93d, #f5c800)', color: 'var(--navy)' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: 'var(--navy)' }} />
                    {tab === 'login' ? 'Signing in...' : 'Submitting...'}
                  </span>
                ) : (
                  tab === 'login' ? 'Sign In →' : 'Submit Application →'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}