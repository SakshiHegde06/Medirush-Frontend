import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function DoctorDashboard() {
  const { currentUser, appointments, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('pending');
  const [toast, setToast] = useState(null);

  // Demo: show all appointments for doctor view
  const myAppointments = appointments;
  const pending = myAppointments.filter(a => a.status === 'pending');
  const accepted = myAppointments.filter(a => a.status === 'accepted');
  const rejected = myAppointments.filter(a => a.status === 'rejected');

  const tabData = { pending, accepted, rejected };
  const displayed = tabData[tab] || [];

  const handleDecision = (id, decision) => {
    updateAppointmentStatus(id, decision);
    showToast(decision === 'accepted' ? '✅ Appointment Accepted — Patient notified' : '❌ Appointment Declined — Patient notified');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,217,61,0.07) 0%, transparent 70%)', top: 0, right: 0 }} />
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 88, right: 24, zIndex: 999,
          background: 'var(--navy-light)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '14px 20px', fontSize: '0.88rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeInUp 0.3s ease forwards',
          color: toast.includes('✅') ? 'var(--teal)' : 'var(--coral)',
        }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36, animation: 'fadeInUp 0.5s ease forwards' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>Welcome back,</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 4 }}>
            {currentUser?.name || 'Doctor'} 🩺
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{currentUser?.specialty || 'General Medicine'}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Pending Review', val: pending.length, color: '#ffd93d', icon: '⏳' },
            { label: 'Appointments Accepted', val: accepted.length, color: '#00c9a7', icon: '✅' },
            { label: 'Total Appointments', val: myAppointments.length, color: '#a78bfa', icon: '📋' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '20px 24px', border: `1px solid ${s.color}25` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: s.color }}>{s.val}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'accepted', label: `Accepted (${accepted.length})` },
            { key: 'rejected', label: `Declined (${rejected.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 20px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
              background: tab === t.key ? '#ffd93d' : 'transparent',
              color: tab === t.key ? 'var(--navy)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: tab === t.key ? 700 : 500,
              transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {displayed.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {tab === 'pending' ? '📭' : tab === 'accepted' ? '✅' : '📋'}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {tab === 'pending' ? 'No pending appointments.' : tab === 'accepted' ? 'No accepted appointments yet.' : 'No declined appointments.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayed.map((apt, i) => (
              <div key={apt.id} className="glass-card" style={{
                padding: '24px',
                border: apt.status === 'pending' ? '1px solid rgba(255,217,61,0.2)' : apt.status === 'accepted' ? '1px solid rgba(0,201,167,0.2)' : '1px solid rgba(255,107,107,0.2)',
                animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'rgba(0,201,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{apt.patientName}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{apt.patientId}</div>
                      </div>
                      <span className={`badge badge-${apt.status === 'accepted' ? 'success' : apt.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {apt.status === 'accepted' ? '✓ Accepted' : apt.status === 'rejected' ? '✗ Declined' : '⏳ Pending'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
                      {[
                        ['📅 Date', `${apt.date} at ${apt.time}`],
                        ['🫀 Condition', apt.disease],
                        ['🔬 Specialty', apt.specialty],
                        ['🏥 Hospital', apt.hospitalName],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    {apt.symptoms?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        {apt.symptoms.map(s => <span key={s} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                      </div>
                    )}

                    {apt.description && (
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--teal)' }}>
                        "{apt.description}"
                      </div>
                    )}
                  </div>

                  {apt.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', flexShrink: 0 }}>
                      <button className="btn-primary" onClick={() => handleDecision(apt.id, 'accepted')} style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
                        ✓ Accept
                      </button>
                      <button className="btn-danger" onClick={() => handleDecision(apt.id, 'rejected')} style={{ padding: '10px 24px' }}>
                        ✗ Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}