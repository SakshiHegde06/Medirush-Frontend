import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const riskConfig = {
  Low: { color: '#00c9a7', bg: 'rgba(0,201,167,0.1)', border: 'rgba(0,201,167,0.3)', icon: '🟢', label: 'Low Risk', msg: 'Your condition appears manageable. Monitor symptoms and consult a doctor if they worsen.' },
  Moderate: { color: '#ffd93d', bg: 'rgba(255,217,61,0.1)', border: 'rgba(255,217,61,0.3)', icon: '🟡', label: 'Moderate Risk', msg: 'Medical consultation recommended within 24-48 hours. Do not ignore your symptoms.' },
  High: { color: '#ff9500', bg: 'rgba(255,149,0,0.1)', border: 'rgba(255,149,0,0.3)', icon: '🟠', label: 'High Risk', msg: 'Please seek medical attention soon. These symptoms may require immediate evaluation.' },
  Critical: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.3)', icon: '🔴', label: 'Critical — Seek Emergency Care', msg: '⚠️ These symptoms may indicate a serious condition. Go to the nearest hospital immediately or call 108.' },
};

export default function AnalysisResult() {
  const { analysisResult } = useApp();
  const navigate = useNavigate();

  if (!analysisResult) {
    navigate('/patient/dashboard');
    return null;
  }

  const { results, selectedSymptoms } = analysisResult;
  const topResult = results[0];
  const risk = riskConfig[topResult.risk];

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: `radial-gradient(circle, ${risk.color}15 0%, transparent 70%)`, top: 0, left: 0 }} />
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate('/patient/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          ← Back to Dashboard
        </button>

        {/* AI Result Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeInUp 0.5s ease forwards' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 20,
            fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600,
          }}>
            🤖 AI ANALYSIS COMPLETE
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', marginBottom: 12 }}>
            Symptom Analysis Report
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Based on {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} analyzed
          </p>
        </div>

        {/* Risk Banner */}
        <div className="glass-card" style={{
          padding: '24px 28px', marginBottom: 24,
          background: risk.bg, border: `1px solid ${risk.border}`,
          animation: 'fadeInUp 0.5s ease 0.1s both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>{risk.icon}</span>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: risk.color }}>{risk.label}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 3 }}>{risk.msg}</p>
            </div>
          </div>
        </div>

        {/* Primary diagnosis */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: 20, animation: 'fadeInUp 0.5s ease 0.2s both', border: `1px solid ${risk.border}` }}>
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Primary Prediction</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 4 }}>{topResult.disease}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 6 }}>{topResult.description}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 700, color: risk.color }}>
                {topResult.confidence}%
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Confidence</div>
            </div>
          </div>

          {/* Confidence bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${topResult.confidence}%`, background: `linear-gradient(90deg, ${risk.color}, ${risk.color}aa)`, borderRadius: 3, transition: 'width 1s ease' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <span className="badge badge-neutral">Recommended Specialist:</span>
            <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.88rem' }}>{topResult.specialty}</span>
          </div>
        </div>

        {/* Other possible conditions */}
        {results.length > 1 && (
          <div style={{ marginBottom: 20, animation: 'fadeInUp 0.5s ease 0.3s both' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              Other Possible Conditions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.slice(1).map((r, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, textAlign: 'right' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.confidence}%</span>
                  </div>
                  <div style={{ height: 4, flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.confidence}%`, background: 'var(--teal)', borderRadius: 2, opacity: 0.5 }} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.disease}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{r.specialty}</div>
                  </div>
                  <span className={`badge badge-${r.risk === 'Low' ? 'success' : r.risk === 'Moderate' ? 'warning' : 'danger'}`}>
                    {r.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms recap */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24, animation: 'fadeInUp 0.5s ease 0.4s both' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Reported Symptoms
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedSymptoms.map(s => (
              <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                {s.icon} {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer + CTA */}
        <div style={{ background: 'rgba(255,217,61,0.06)', border: '1px solid rgba(255,217,61,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          ⚠️ <strong style={{ color: 'var(--amber)' }}>Disclaimer:</strong> This AI analysis is for informational purposes only and does not replace a professional medical diagnosis. Always consult a qualified healthcare provider.
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeInUp 0.5s ease 0.5s both' }}>
          <button className="btn-primary" onClick={() => navigate('/patient/hospitals')} style={{ flex: 1, padding: '16px', fontSize: '1rem' }}>
            🏥 Find Hospitals Near Me →
          </button>
          <button className="btn-secondary" onClick={() => navigate('/patient/dashboard')} style={{ padding: '16px 28px', fontSize: '0.9rem' }}>
            Check Again
          </button>
        </div>
      </div>
    </div>
  );
}