import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { getMyAppointments, cancelAppointment } from "../api/index"
import { analyzeSymptoms, SYMPTOMS } from "../data/symptoms"
import RatingModal from "../components/RatingModal"

export default function PatientDashboard() {
  const { currentUser, logout, setAnalysisResult } = useApp()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [description, setDescription] = useState("")
  const [ratingAppointment, setRatingAppointment] = useState(null)
  const [ratedIds, setRatedIds] = useState(() => {
    const saved = localStorage.getItem("ratedAppointments")
    return saved ? JSON.parse(saved) : []
  })

  const symptoms = SYMPTOMS.map(s => s.name)

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await getMyAppointments()
      if (Array.isArray(data)) setAppointments(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const convertTo24Hour = (time) => {
    if (!time) return "00:00:00"
    const [t, period] = time.split(" ")
    let [h, m] = t.split(":")
    h = parseInt(h)
    if (period === "PM" && h !== 12) h = h + 12
    if (period === "AM" && h === 12) h = 0
    return `${String(h).padStart(2, "0")}:${m}:00`
  }

  const handleCancel = async (apt) => {
    const aptDateTime = new Date(`${apt.date}T${convertTo24Hour(apt.time)}`)
    const hoursLeft = (aptDateTime - new Date()) / (1000 * 60 * 60)
    if (hoursLeft < 24) {
      alert("Cannot cancel within 24 hours of appointment. Token is non-refundable.")
      return
    }
    if (!window.confirm(`Cancel appointment with ${apt.doctor_name} on ${apt.date} at ${apt.time}?`)) return
    const res = await cancelAppointment(apt.id)
    if (res.message === "Appointment cancelled successfully") {
      fetchAppointments()
    } else {
      alert(res.message || "Failed to cancel")
    }
  }

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return
    const result = analyzeSymptoms(selectedSymptoms, description)
    setAnalysisResult({ results: result, selectedSymptoms })
    navigate("/patient/analysis")
  }

  const handleRated = (appointmentId) => {
    const updated = [...ratedIds, appointmentId]
    setRatedIds(updated)
    localStorage.setItem("ratedAppointments", JSON.stringify(updated))
    fetchAppointments()
  }

  const statusColor = {
    pending: "var(--amber)", accepted: "var(--teal)",
    rejected: "var(--coral)", completed: "#a78bfa",
    cancelled: "var(--text-dim)"
  }

  const pending = appointments.filter(a => a.status === "pending")
  const accepted = appointments.filter(a => a.status === "accepted")
  const completed = appointments.filter(a => a.status === "completed")

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: -150, right: -100 }} />
      <Navbar />

      {ratingAppointment && (
        <RatingModal
          appointment={ratingAppointment}
          onClose={() => setRatingAppointment(null)}
          onSuccess={() => handleRated(ratingAppointment.id)}
        />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>Welcome back</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>{currentUser?.name} 👋</h1>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-secondary" onClick={() => navigate("/patient/records")} style={{ padding: "8px 16px", fontSize: "0.82rem" }}>📋 Medical Records</button>
            <button className="btn-secondary" onClick={() => navigate("/patient/consult")} style={{ padding: "8px 16px", fontSize: "0.82rem" }}>💬 Online Consult</button>
            <button className="btn-secondary" onClick={() => { logout(); navigate("/") }} style={{ padding: "8px 16px", fontSize: "0.82rem" }}>Logout</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total", val: appointments.length, color: "#a78bfa" },
            { label: "Pending", val: pending.length, color: "var(--amber)" },
            { label: "Accepted", val: accepted.length, color: "var(--teal)" },
            { label: "Completed", val: completed.length, color: "#61dafb" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "28px", marginBottom: 28, border: "1px solid rgba(0,201,167,0.15)" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", marginBottom: 6 }}>🔬 AI Symptom Checker</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>Select your symptoms and get AI-powered analysis</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {symptoms.map(s => (
              <button key={s} onClick={() => toggleSymptom(s)} style={{
                padding: "6px 14px", borderRadius: 100, border: "1px solid",
                borderColor: selectedSymptoms.includes(s) ? "var(--teal)" : "var(--border)",
                background: selectedSymptoms.includes(s) ? "rgba(0,201,167,0.15)" : "transparent",
                color: selectedSymptoms.includes(s) ? "var(--teal)" : "var(--text-secondary)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem",
                transition: "all 0.2s", fontWeight: selectedSymptoms.includes(s) ? 600 : 400,
              }}>
                {selectedSymptoms.includes(s) ? "✓ " : ""}{s}
              </button>
            ))}
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Describe your symptoms in detail (optional)..."
            rows={2}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.85rem", outline: "none", resize: "none", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={handleAnalyze} disabled={selectedSymptoms.length === 0}
              style={{ padding: "10px 28px", opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}>
              Analyze Symptoms →
            </button>
            {selectedSymptoms.length > 0 && (
              <span style={{ color: "var(--teal)", fontSize: "0.82rem" }}>{selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? "s" : ""} selected</span>
            )}
            {selectedSymptoms.length > 0 && (
              <button onClick={() => setSelectedSymptoms([])} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.78rem" }}>Clear all</button>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", marginBottom: 20 }}>📅 My Appointments</h2>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)" }}>
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
              <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No appointments yet.</p>
              <button className="btn-primary" onClick={() => navigate("/patient/hospitals")} style={{ padding: "10px 24px" }}>Book an Appointment →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {appointments.map((apt, i) => (
                <div key={apt.id} className="glass-card" style={{
                  padding: "20px 24px", border: "1px solid var(--border)",
                  animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
                  opacity: apt.status === "cancelled" ? 0.7 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>{apt.doctor_name}</h3>
                        <span style={{
                          padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700,
                          background: `${statusColor[apt.status]}20`, color: statusColor[apt.status],
                          border: `1px solid ${statusColor[apt.status]}40`, textTransform: "capitalize"
                        }}>
                          {apt.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                        {[["🏥", apt.hospital_name], ["🔬", apt.specialty], ["📅", apt.date], ["⏰", apt.time]].map(([icon, val]) => val && (
                          <span key={icon} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{icon} {val}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, justifyContent: "center" }}>
                      {apt.status === "completed" && !ratedIds.includes(apt.id) && (
                        <button onClick={() => setRatingAppointment(apt)} style={{
                          padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,217,61,0.4)",
                          background: "rgba(255,217,61,0.1)", color: "#ffd93d",
                          cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600,
                        }}>
                          ⭐ Rate Doctor
                        </button>
                      )}
                      {apt.status === "completed" && ratedIds.includes(apt.id) && (
                        <span style={{ fontSize: "0.78rem", color: "var(--teal)", fontWeight: 600 }}>✅ Rated</span>
                      )}
                      {(apt.status === "pending" || apt.status === "accepted") && (
                        <button onClick={() => handleCancel(apt)} style={{
                          padding: "6px 14px", borderRadius: 8,
                          border: "1px solid rgba(255,107,107,0.4)",
                          background: "rgba(255,107,107,0.08)", color: "var(--coral)",
                          cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 600,
                        }}>
                          Cancel
                        </button>
                      )}
                      {apt.status === "cancelled" && (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 600 }}>❌ Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
