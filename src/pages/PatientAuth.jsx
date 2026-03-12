import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function PatientAuth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (tab === 'signup' && !form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (tab === 'signup' && !form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      login('patient', { id: 'P_NEW', name: form.name || 'Patient User', email: form.email, phone: form.phone });
      navigate('/patient/dashboard');
    }, 1200);
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 70%)', top: -150, right: -100 }} />
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'fadeInUp 0.5s ease forwards' }}>

          {/* Back */}
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
            ← Back to Home
          </button>

          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(0,201,167,0.2)' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 6 }}>Patient Portal</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {tab === 'login' ? 'Welcome back! Sign in to your account.' : 'Create an account to get started.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 28 }}>
              <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrors({}); }}>Sign In</button>
              <button className={`tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setErrors({}); }}>Sign Up</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tab === 'signup' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ananya Sharma" />
                  {errors.name && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@gmail.com" />
                {errors.email && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.email}</span>}
              </div>

              {tab === 'signup' && (
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.phone}</span>}
                </div>
              )}

              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
                {errors.password && <span style={{ color: 'var(--coral)', fontSize: '0.75rem' }}>{errors.password}</span>}
              </div>

              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8, padding: '14px', fontSize: '0.95rem', width: '100%' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    {tab === 'login' ? 'Signing in...' : 'Creating Account...'}
                  </span>
                ) : (
                  tab === 'login' ? 'Sign In →' : 'Create Account →'
                )}
              </button>

              {tab === 'login' && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Don't have an account?{' '}
                  <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>Sign up here</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}