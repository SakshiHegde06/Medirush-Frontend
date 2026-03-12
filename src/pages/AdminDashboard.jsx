import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { doctors, appointments, patients, verifyDoctor, removeDoctor } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('doctors');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleVerify = (doc) => {
    verifyDoctor(doc.id);
    showToast(`✅ Dr. ${doc.name.replace('Dr. ', '')} has been verified`);
  };

  const handleRemove = (doc) => {
    removeDoctor(doc.id);
    setConfirmRemove(null);
    showToast(`Removed ${doc.name} from the platform`, 'danger');
  };

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNo?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingDocs = doctors.filter(d => d.status === 'pending');
  const verifiedDocs = doctors.filter(d => d.status === 'verified');

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%)', top: 0, left: 0 }} />
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 88, right: 24, zIndex: 999,
          background: 'var(--navy-light)', border: `1px solid ${toast.type === 'danger' ? 'rgba(255,107,107,0.4)' : 'rgba(0,201,167,0.4)'}`,
          borderRadius: 10, padding: '14px 20px', fontSize: '0.88rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeInUp 0.3s ease forwards',
          color: toast.type === 'danger' ? 'var(--coral)' : 'var(--teal)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmRemove && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 998 }}>
          <div className="glass-card" style={{ padding: 40, maxWidth: 380, width: '90%', textAlign: 'center', border: '1px solid rgba(255,107,107,0.3)', animation: 'fadeInUp 0.3s ease forwards' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', marginBottom: 10 }}>Remove Doctor?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.7 }}>
              Are you sure you want to remove <strong>{confirmRemove.name}</strong> from the platform? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-danger" onClick={() => handleRemove(confirmRemove)} style={{ padding: '10px 24px' }}>Yes, Remove</button>
              <button className="btn-secondary" onClick={() => setConfirmRemove(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36, animation: 'fadeInUp 0.5s ease forwards' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>Administrator</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem' }}>Admin Dashboard 🛡️</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Doctors', val: doctors.length, color: '#a78bfa', icon: '🩺' },
            { label: 'Pending Verification', val: pendingDocs.length, color: '#ffd93d', icon: '⏳' },
            { label: 'Verified Doctors', val: verifiedDocs.length, color: '#00c9a7', icon: '✅' },
            { label: 'Total Appointments', val: appointments.length, color: '#ff6b6b', icon: '📅' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '20px', border: `1px solid ${s.color}25` }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: s.color }}>{s.val}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {[
            { key: 'doctors', label: 'Doctor Management' },
            { key: 'appointments', label: 'All Appointments' },
            { key: 'patients', label: 'Patient Records' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 20px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
              background: tab === t.key ? '#ff6b6b' : 'transparent',
              color: tab === t.key ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: tab === t.key ? 700 : 500,
              transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* DOCTORS */}
        {tab === 'doctors' && (
          <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search by name, license, specialty..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '10px 16px', color: 'var(--text-primary)',
                  fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
                }}
              />
            </div>

            {pendingDocs.length > 0 && (
              <div style={{
                background: 'rgba(255,217,61,0.06)', border: '1px solid rgba(255,217,61,0.2)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.85rem', color: 'var(--amber)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ <strong>{pendingDocs.length} doctor{pendingDocs.length !== 1 ? 's' : ''} awaiting license verification</strong>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredDoctors.map((doc, i) => (
                <div key={doc.id} className="glass-card" style={{
                  padding: '20px 24px',
                  border: `1px solid ${doc.status === 'pending' ? 'rgba(255,217,61,0.25)' : 'var(--border)'}`,
                  animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: doc.status === 'verified' ? 'rgba(0,201,167,0.15)' : 'rgba(255,217,61,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}>🩺</div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doc.name}</span>
                          <span className={`badge badge-${doc.status === 'verified' ? 'success' : 'warning'}`}>
                            {doc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 3 }}>
                          {doc.qualification} · {doc.specialty}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          🏥 {doc.hospital}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>License No.</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: doc.status === 'verified' ? 'var(--teal)' : 'var(--amber)' }}>
                          {doc.licenseNo}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {doc.status === 'pending' && (
                          <button className="btn-primary" onClick={() => handleVerify(doc)} style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                            Verify
                          </button>
                        )}
                        <button className="btn-danger" onClick={() => setConfirmRemove(doc)} style={{ padding: '8px 16px' }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {tab === 'appointments' && (
          <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {appointments.map((apt, i) => (
                <div key={apt.id} className="glass-card" style={{ padding: '20px 24px', animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{apt.patientName} → {apt.doctorName}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: 6 }}>
                        {apt.hospitalName} · {apt.specialty} · {apt.date} at {apt.time}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {apt.symptoms?.map(s => <span key={s} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge badge-${apt.status === 'accepted' ? 'success' : apt.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {apt.status}
                      </span>
                      <div style={{ color: 'var(--teal)', fontSize: '0.82rem', marginTop: 6, fontWeight: 600 }}>{apt.disease}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {tab === 'patients' && (
          <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {patients.map((p, i) => (
                <div key={p.id} className="glass-card" style={{ padding: '24px', animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,201,167,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{p.email} · {p.phone}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.id}</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>
                      Medical History
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {p.history.map((h, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{h.disease}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}> · {h.doctor}</span>
                          </div>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}