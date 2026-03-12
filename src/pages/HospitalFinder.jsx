import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { MOCK_HOSPITALS } from '../data/symptoms';

export default function HospitalFinder() {
  const { analysisResult } = useApp();
  const navigate = useNavigate();
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const specialty = analysisResult?.results?.[0]?.specialty || 'General Medicine';

  const requestLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => { setLocationGranted(true); setLoading(false); }, 800);
        },
        () => {
          // Permission denied or error — show hospitals anyway (mock)
          setTimeout(() => { setLocationGranted(true); setLoading(false); }, 800);
        }
      );
    } else {
      setTimeout(() => { setLocationGranted(true); setLoading(false); }, 800);
    }
  };

  const relevantHospitals = MOCK_HOSPITALS.filter(h =>
    h.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()) || specialty.toLowerCase().includes(s.toLowerCase()))
  );
  const otherHospitals = MOCK_HOSPITALS.filter(h => !relevantHospitals.find(r => r.id === h.id));
  const allHospitals = [...relevantHospitals, ...otherHospitals];

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)', top: 0, right: 0 }} />
      <Navbar />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate('/patient/analysis')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          ← Back to Analysis
        </button>

        <div style={{ marginBottom: 36, animation: 'fadeInUp 0.5s ease forwards' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 8 }}>Find Hospitals Near You</h1>
          {analysisResult && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Showing hospitals with <strong style={{ color: 'var(--teal)' }}>{specialty}</strong> specialists based on your diagnosis.
            </p>
          )}
        </div>

        {/* Location prompt */}
        {!locationGranted && (
          <div className="glass-card" style={{
            padding: '48px', textAlign: 'center', marginBottom: 32,
            border: '1px solid rgba(0,201,167,0.2)',
            animation: 'fadeInUp 0.5s ease 0.1s both',
          }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📍</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 10 }}>Enable Location</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.7, fontSize: '0.9rem' }}>
              To find hospitals nearest to you, MediRush needs access to your current location.
            </p>
            <button className="btn-primary" onClick={requestLocation} disabled={loading} style={{ padding: '14px 40px', fontSize: '0.95rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Getting Location...
                </span>
              ) : '📍 Turn On Location →'}
            </button>
            <button onClick={() => setLocationGranted(true)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', marginTop: 16, fontSize: '0.8rem', display: 'block', margin: '16px auto 0' }}>
              Skip — Show All Hospitals
            </button>
          </div>
        )}

        {/* Hospital listing */}
        {locationGranted && (
          <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
            {relevantHospitals.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ background: 'rgba(0,201,167,0.15)', color: 'var(--teal)', border: '1px solid rgba(0,201,167,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ✦ RECOMMENDED
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Hospitals with {specialty} specialists</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {allHospitals.map((h, i) => {
                const isRelevant = relevantHospitals.find(r => r.id === h.id);
                return (
                  <div key={h.id} className="glass-card" style={{
                    padding: '24px',
                    border: `1px solid ${isRelevant ? 'rgba(0,201,167,0.3)' : 'var(--border)'}`,
                    animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{h.name}</h3>
                          {isRelevant && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✦ Matches Your Diagnosis</span>}
                          {h.emergency && <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>⚡ 24/7 Emergency</span>}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: 10 }}>
                          📍 {h.address} · <span style={{ color: 'var(--teal)' }}>{h.distance}</span> away
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {h.specialties.map(s => (
                            <span key={s} style={{
                              padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem',
                              background: s === specialty ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${s === specialty ? 'rgba(0,201,167,0.4)' : 'var(--border)'}`,
                              color: s === specialty ? 'var(--teal)' : 'var(--text-secondary)',
                              fontWeight: s === specialty ? 600 : 400,
                            }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffd93d', marginBottom: 4 }}>
                          ⭐ {h.rating}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: 12 }}>
                          {h.beds} beds
                        </div>
                        <button
                          className="btn-primary"
                          onClick={() => navigate(`/patient/slots/${h.id}`)}
                          style={{ padding: '9px 20px', fontSize: '0.83rem' }}
                        >
                          View Slots →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}