import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function AdminAuth() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!form.username || !form.password) { setError('Please enter both username and password.'); return; }
    if (form.username !== 'admin' || form.password !== 'admin123') { setError('Invalid credentials. Try admin / admin123'); return; }
    setLoading(true);
    setTimeout(() => {
      login('admin', { id: 'ADMIN1', name: 'Admin', username: form.username });
      navigate('/admin/dashboard');
    }, 900);
  };

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)', bottom: 0, right: 0 }} />
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
            ← Back to Home
          </button>

          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(255,107,107,0.2)' }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 6 }}>Admin Portal</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Restricted access. Authorized personnel only.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Username</label>
                <input value={form.username} onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError(''); }} placeholder="admin" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>

              {error && (
                <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--coral)' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                Demo: username: <strong style={{ color: 'var(--teal)' }}>admin</strong> / password: <strong style={{ color: 'var(--teal)' }}>admin123</strong>
              </div>

              <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ marginTop: 8, padding: '14px', fontSize: '0.95rem', width: '100%', background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: 'white' }} />
                    Authenticating...
                  </span>
                ) : 'Access Admin Panel →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}