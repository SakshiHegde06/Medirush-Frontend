import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { getMyAppointments } from "../api/index"
import { SYMPTOMS, CATEGORIES, analyzeSymptoms } from "../data/symptoms"

export default function PatientDashboard() {
  const { currentUser, logout, analysisResult, setAnalysisResult } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("checker")
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [loadingApts, setLoadingApts] = useState(false)

  useEffect(() => {
    if (activeTab === "appointments") fetchAppointments()
  }, [activeTab])

  const fetchAppointments = async () => {
    setLoadingApts(true)
    try {
      const data = await getMyAppointments()
      if (Array.isArray(data)) setAppointments(data)
    } catch (err) { console.error(err) }
    setLoadingApts(false)
  }

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return
    setAnalyzing(true)
    setTimeout(() => {
      const result = analyzeSymptoms(selectedSymptoms, description)
      setAnalysisResult(result)
      setAnalyzing(false)
      navigate("/patient/analysis")
    }, 2000)
  }

  const statusColor = { pending: "var(--amber)", accepted: "var(--teal)", rejected: "var(--coral)", completed: "#a78bfa", cancelled: "var(--text-dim)" }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>Welcome back</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>
              {currentUser?.name || "Patient"} 👋
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/patient/consult")} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}>
              🎥 Online Consult
            </button>
            <button onClick={() => navigate("/patient/records")} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.color = "#a78bfa" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}>
              📋 Medical Records
            </button>
            <button onClick={() => { logout(); navigate("/") }} className="btn-secondary" style={{ padding: "8px 18px", fontSize: "0.82rem" }}>Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28, width: "fit-content", flexWrap: "wrap" }}>
          {[["🩺", "Check Symptoms", "checker"], ["📅", "My Appointments", "appointments"], ["📋", "Health History", "history"]].map(([icon, label, tab]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 18px", borderRadius: 7, border: "none",
              background: activeTab === tab ? "var(--teal)" : "transparent",
              color: activeTab === tab ? "var(--navy)" : "var(--text-secondary)",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600,
              transition: "all 0.2s",
            }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* SYMPTOM CHECKER */}
        {activeTab === "checker" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 8 }}>AI Symptom Checker</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Select your symptoms and get an AI-powered health analysis.</p>
            </div>

            {CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 10 }}>{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SYMPTOMS.filter(s => s.category === cat).map(s => (
                    <button key={s.name} onClick={() => toggleSymptom(s.name)} style={{
                      padding: "6px 14px", borderRadius: 100, border: "1px solid",
                      borderColor: selectedSymptoms.includes(s.name) ? "var(--teal)" : "var(--border)",
                      background: selectedSymptoms.includes(s.name) ? "rgba(0,201,167,0.15)" : "transparent",
                      color: selectedSymptoms.includes(s.name) ? "var(--teal)" : "var(--text-secondary)",
                      cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", transition: "all 0.2s",
                    }}>{s.name}</button>
                  ))}
                </div>
              </div>
            ))}

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Describe your condition (optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                placeholder="Any additional details about your symptoms..."
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", resize: "vertical" }} />
            </div>

            {selectedSymptoms.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 8 }}>Selected: {selectedSymptoms.length} symptom(s)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedSymptoms.map(s => (
                    <span key={s} style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(0,201,167,0.15)", border: "1px solid rgba(0,201,167,0.3)", color: "var(--teal)", fontSize: "0.78rem", cursor: "pointer" }} onClick={() => toggleSymptom(s)}>
                      {s} ×
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="btn-primary" onClick={handleAnalyze} disabled={selectedSymptoms.length === 0 || analyzing}
              style={{ padding: "13px 32px", fontSize: "0.95rem", opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}>
              {analyzing
                ? <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Analyzing symptoms...
                  </span>
                : "Analyze Symptoms →"
              }
            </button>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 20 }}>My Appointments</h2>
            {loadingApts ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)" }}>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>No appointments yet.</p>
                <button className="btn-primary" onClick={() => navigate("/patient/analysis")} style={{ padding: "10px 24px" }}>
                  Check Symptoms First →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {appointments.map((apt, i) => (
                  <div key={apt.id} className="glass-card" style={{ padding: "22px 24px", border: "1px solid var(--border)", animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <h3 style={{ fontWeight: 700 }}>{apt.doctor_name}</h3>
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: `${statusColor[apt.status]}20`, color: statusColor[apt.status], border: `1px solid ${statusColor[apt.status]}40`, textTransform: "capitalize" }}>
                            {apt.status}
                          </span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", marginBottom: 4 }}>🏥 {apt.hospital_name} · {apt.specialty}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem" }}>📅 {apt.date} at {apt.time}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--teal)", fontSize: "0.85rem", fontWeight: 600 }}>{apt.disease}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 20 }}>Health History</h2>
            <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <p style={{ color: "var(--text-secondary)" }}>Your completed appointment history will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
