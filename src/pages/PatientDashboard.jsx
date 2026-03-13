import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Chatbot from "../components/Chatbot"
import RatingModal from "../components/RatingModal"
import { useApp } from "../context/AppContext"
import { useLang } from "../context/LangContext"
import { SYMPTOMS, CATEGORIES, analyzeSymptoms } from "../data/symptoms"
import { MOCK_SLOTS } from "../data/symptoms"

export default function PatientDashboard() {
  const { currentUser, appointments, setAnalysisResult, updateAppointmentStatus } = useApp()
  const { t } = useLang()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("checker")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [ratingApt, setRatingApt] = useState(null)
  const [rescheduleApt, setRescheduleApt] = useState(null)
  const [newSlot, setNewSlot] = useState("")
  const [ratings, setRatings] = useState({})
  const [toast, setToast] = useState(null)

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.find(p => p.id === s.id) ? prev.filter(p => p.id !== s.id) : [...prev, s])
  }

  const filteredSymptoms = selectedCategory === "All" ? SYMPTOMS : SYMPTOMS.filter(s => s.category === selectedCategory)

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return
    setAnalyzing(true)
    setTimeout(() => {
      const results = analyzeSymptoms(selectedSymptoms, description)
      setAnalysisResult({ results, selectedSymptoms, description })
      setAnalyzing(false)
      navigate("/patient/analysis")
    }, 2000)
  }

  const canReschedule = (apt) => {
    const aptDateTime = new Date(`${apt.date} ${apt.time}`)
    const now = new Date()
    const hoursLeft = (aptDateTime - now) / (1000 * 60 * 60)
    return hoursLeft > 24
  }

  const handleReschedule = (apt) => {
    if (!canReschedule(apt)) return
    setRescheduleApt(apt)
    setNewSlot("")
  }

  const confirmReschedule = () => {
    if (!newSlot) return
    updateAppointmentStatus(rescheduleApt.id, "pending")
    setRescheduleApt(null)
    setToast("✅ " + t.rescheduled)
    setTimeout(() => setToast(null), 3000)
  }

  const handleRatingSubmit = ({ appointmentId, rating, feedback }) => {
    setRatings(prev => ({ ...prev, [appointmentId]: { rating, feedback } }))
    setRatingApt(null)
    setToast("⭐ Rating submitted! Thank you.")
    setTimeout(() => setToast(null), 3000)
  }

  const myHistory = [
    { date: "2026-02-20", disease: "Gastroenteritis", doctor: "Dr. Priya Nair", hospital: "Apollo Hospital", status: "Recovered" },
    { date: "2026-01-10", disease: "Influenza", doctor: "Dr. General Physician", hospital: "City Clinic", status: "Recovered" },
    { date: "2025-11-15", disease: "Migraine", doctor: "Dr. Rahul Verma", hospital: "AIIMS Delhi", status: "Ongoing Treatment" },
  ]

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 100, right: 0 }} />
      <Navbar />
      <Chatbot />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 88, right: 24, zIndex: 999, background: "var(--navy-light)", border: "1px solid rgba(0,201,167,0.4)", borderRadius: 10, padding: "14px 20px", fontSize: "0.88rem", color: "var(--teal)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeInUp 0.3s ease forwards" }}>
          {toast}
        </div>
      )}

      {/* Rating Modal */}
      {ratingApt && (
        <RatingModal appointment={ratingApt} onSubmit={handleRatingSubmit} onClose={() => setRatingApt(null)} />
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
          <div className="glass-card" style={{ maxWidth: 440, width: "100%", padding: 36, border: "1px solid rgba(0,201,167,0.3)", animation: "fadeInUp 0.3s ease forwards" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 8 }}>📅 {t.reschedule}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 6 }}>{rescheduleApt.doctorName} · {rescheduleApt.hospitalName}</p>
            <div style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: "0.8rem", color: "var(--teal)", marginBottom: 20 }}>
              ✅ {t.tokenCarryForward}
            </div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 12 }}>{t.selectNewSlot}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
              {MOCK_SLOTS.map(slot => (
                <button key={slot} onClick={() => setNewSlot(slot)} style={{
                  padding: "9px", borderRadius: 8, border: "1px solid",
                  borderColor: newSlot === slot ? "var(--teal)" : "var(--border)",
                  background: newSlot === slot ? "rgba(0,201,167,0.12)" : "transparent",
                  color: newSlot === slot ? "var(--teal)" : "var(--text-primary)",
                  cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem",
                  transition: "all 0.2s",
                }}>
                  {slot}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" onClick={confirmReschedule} disabled={!newSlot} style={{ flex: 1, padding: "12px", opacity: !newSlot ? 0.5 : 1 }}>
                Confirm Reschedule →
              </button>
              <button className="btn-secondary" onClick={() => setRescheduleApt(null)} style={{ padding: "12px 20px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36, animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>{t.goodMorning}</p>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", letterSpacing: "-0.02em" }}>
                {currentUser?.name || "Patient"} 👋
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
  {[['🩺', 'Check Symptoms', 'checker'], ['📅', 'Appointments', 'appointments'], ['📋', 'Health History', 'history']].map(([icon, label, tab]) => (
    <button key={tab} onClick={() => setActiveTab(tab)} style={{
      padding: '8px 18px', borderRadius: 8, border: '1px solid',
      background: activeTab === tab ? 'var(--teal)' : 'transparent',
      borderColor: activeTab === tab ? 'var(--teal)' : 'var(--border)',
      color: activeTab === tab ? 'var(--navy)' : 'var(--text-secondary)',
      cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
      transition: 'all 0.2s',
    }}>
      {icon} {label}
    </button>
  ))}
  <button onClick={() => navigate('/patient/consult')} style={{
    padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text-secondary)',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
    transition: 'all 0.2s',
  }}>
    🎥 Online Consult
  </button>
  <button onClick={() => navigate('/patient/records')} style={{
    padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text-secondary)',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
    transition: 'all 0.2s',
  }}>
    📋 Medical Records
  </button>
</div>
          </div>
        </div>

        {/* SYMPTOM CHECKER */}
        {activeTab === "checker" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
              <div>
                <div className="glass-card" style={{ padding: "28px", marginBottom: 20 }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>{t.selectSymptoms}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", marginBottom: 20 }}>Choose all symptoms you are currently experiencing.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                        padding: "5px 14px", borderRadius: 100, border: "1px solid",
                        borderColor: selectedCategory === cat ? "var(--teal)" : "var(--border)",
                        background: selectedCategory === cat ? "rgba(0,201,167,0.15)" : "transparent",
                        color: selectedCategory === cat ? "var(--teal)" : "var(--text-secondary)",
                        cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 500,
                        transition: "all 0.2s",
                      }}>{cat}</button>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                    {filteredSymptoms.map(s => {
                      const selected = selectedSymptoms.find(p => p.id === s.id)
                      return (
                        <button key={s.id} onClick={() => toggleSymptom(s)} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "10px 14px", borderRadius: 10, border: "1px solid",
                          borderColor: selected ? "var(--teal)" : "var(--border)",
                          background: selected ? "rgba(0,201,167,0.12)" : "rgba(255,255,255,0.02)",
                          color: selected ? "var(--teal)" : "var(--text-primary)",
                          cursor: "pointer", fontFamily: "inherit", fontSize: "0.83rem",
                          transition: "all 0.2s", textAlign: "left",
                        }}>
                          <span style={{ fontSize: 18 }}>{s.icon}</span>
                          <span style={{ fontWeight: selected ? 600 : 400 }}>{s.name}</span>
                          {selected && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: "28px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>{t.describeCondition}</h3>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your symptoms in detail..."
                    style={{ height: 120, resize: "vertical", lineHeight: 1.6, fontSize: "0.88rem", width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontFamily: "inherit", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
                <div className="glass-card" style={{ padding: "28px", border: "1px solid rgba(0,201,167,0.2)" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>
                    {t.selectedSymptoms} <span style={{ color: "var(--teal)", fontFamily: "'JetBrains Mono', monospace" }}>({selectedSymptoms.length})</span>
                  </h3>
                  {selectedSymptoms.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-dim)" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                      <p style={{ fontSize: "0.83rem" }}>{t.noSymptoms}</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, maxHeight: 280, overflowY: "auto" }}>
                      {selectedSymptoms.map(s => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(0,201,167,0.08)", borderRadius: 8, border: "1px solid rgba(0,201,167,0.2)" }}>
                          <span style={{ fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6 }}>
                            <span>{s.icon}</span> {s.name}
                          </span>
                          <button onClick={() => toggleSymptom(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--coral)", fontSize: "0.9rem" }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <hr className="divider" />
                  <button className="btn-primary" onClick={handleAnalyze} disabled={selectedSymptoms.length === 0 || analyzing}
                    style={{ width: "100%", padding: "14px", fontSize: "0.95rem", opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}>
                    {analyzing ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        {t.analyzing}
                      </span>
                    ) : t.analyzeAI}
                  </button>
                  {selectedSymptoms.length > 0 && !analyzing && (
                    <button onClick={() => setSelectedSymptoms([])} className="btn-secondary" style={{ width: "100%", padding: "10px", marginTop: 10, fontSize: "0.82rem" }}>
                      {t.clearAll}
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                  {[["2", "Past Appointments"], ["3", "Health Records"]].map(([val, label]) => (
                    <div key={label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--teal)" }}>{val}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.72rem", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 24 }}>{t.appointments}</h2>
            {appointments.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                <p style={{ color: "var(--text-secondary)" }}>No appointments yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {appointments.map(apt => {
                  const rescheduleOk = canReschedule(apt)
                  const alreadyRated = ratings[apt.id]
                  return (
                    <div key={apt.id} className="glass-card" style={{ padding: "24px", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{apt.doctorName}</h3>
                            <span className={`badge badge-${apt.status === "accepted" ? "success" : apt.status === "rejected" ? "danger" : "warning"}`}>
                              {apt.status === "accepted" ? "✓ " + t.accepted : apt.status === "rejected" ? "✗ " + t.rejected : "⏳ " + t.pending}
                            </span>
                          </div>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>{apt.hospitalName} · {apt.specialty}</p>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>📅 {apt.date} at {apt.time}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                            {apt.symptoms?.map(s => <span key={s} className="badge badge-neutral">{s}</span>)}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                          <div style={{ color: "var(--teal)", fontSize: "0.85rem", fontWeight: 600 }}>{apt.disease}</div>

                          {/* Reschedule button */}
                          {apt.status !== "rejected" && (
                            <button onClick={() => handleReschedule(apt)}
                              disabled={!rescheduleOk}
                              title={!rescheduleOk ? t.cancelReschedule : t.reschedule}
                              style={{
                                padding: "7px 14px", borderRadius: 8, border: "1px solid",
                                borderColor: rescheduleOk ? "var(--teal)" : "var(--border)",
                                background: "transparent",
                                color: rescheduleOk ? "var(--teal)" : "var(--text-dim)",
                                cursor: rescheduleOk ? "pointer" : "not-allowed",
                                fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 500,
                              }}>
                              📅 {t.reschedule}
                            </button>
                          )}

                          {/* Rating button */}
                          {apt.status === "accepted" && !alreadyRated && (
                            <button onClick={() => setRatingApt(apt)} style={{
                              padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,217,61,0.4)",
                              background: "rgba(255,217,61,0.08)", color: "var(--amber)",
                              cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 500,
                            }}>
                              ⭐ {t.rateDoctor}
                            </button>
                          )}
                          {alreadyRated && (
                            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                              {"⭐".repeat(alreadyRated.rating)} Rated
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status messages */}
                      {apt.status === "accepted" && (
                        <div style={{ marginTop: 16, padding: "12px", background: "rgba(0,201,167,0.08)", borderRadius: 8, border: "1px solid rgba(0,201,167,0.2)", fontSize: "0.82rem", color: "var(--teal)" }}>
                          ✅ Appointment confirmed. Please arrive 15 minutes early.
                        </div>
                      )}
                      {apt.status === "rejected" && (
                        <div style={{ marginTop: 16, padding: "12px", background: "rgba(255,107,107,0.08)", borderRadius: 8, border: "1px solid rgba(255,107,107,0.2)", fontSize: "0.82rem", color: "var(--coral)" }}>
                          ❌ Doctor unavailable. Please try a different slot. Note: ₹250 token is non-refundable.
                        </div>
                      )}
                      {!rescheduleOk && apt.status !== "rejected" && (
                        <div style={{ marginTop: 10, fontSize: "0.76rem", color: "var(--text-dim)" }}>
                          ⏰ {t.noReschedule}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 24 }}>{t.healthHistory}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myHistory.map((h, i) => (
                <div key={i} className="glass-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,201,167,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏥</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{h.disease}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.83rem" }}>{h.doctor} · {h.hospital}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{h.date}</div>
                    <span className={`badge ${h.status === "Recovered" ? "badge-success" : "badge-warning"}`} style={{ marginTop: 4 }}>
                      {h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

