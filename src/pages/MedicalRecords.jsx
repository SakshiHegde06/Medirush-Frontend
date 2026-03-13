import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"

export default function MedicalRecords() {
  const { consultations, currentUser } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState("All")

  const modes = ["All", "Video", "Audio", "Chat"]
  const myConsultations = consultations.filter(c => c.patientId === "P001" || c.patientId === currentUser?.id)
  const filtered = filter === "All" ? myConsultations : myConsultations.filter(c => c.mode === filter)

  const modeIcon = { Video: "🎥", Audio: "🎤", Chat: "💬" }
  const modeColor = { Video: "#00c9a7", Audio: "#a78bfa", Chat: "#ffd93d" }

  const totalSpent = myConsultations.reduce((sum, c) => sum + c.fee, 0)

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)", top: 0, left: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <button onClick={() => navigate("/patient/dashboard")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 36, animation: "fadeInUp 0.5s ease forwards" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 8 }}>📋 Medical Records</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Your complete consultation history for the past year</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total Consultations", val: myConsultations.length, color: "var(--teal)", icon: "🩺" },
            { label: "Video Calls", val: myConsultations.filter(c => c.mode === "Video").length, color: "#00c9a7", icon: "🎥" },
            { label: "Audio Calls", val: myConsultations.filter(c => c.mode === "Audio").length, color: "#a78bfa", icon: "🎤" },
            { label: "Total Spent", val: `₹${totalSpent}`, color: "#ffd93d", icon: "💰" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {modes.map(m => (
            <button key={m} onClick={() => setFilter(m)} style={{
              padding: "6px 18px", borderRadius: 100, border: "1px solid",
              borderColor: filter === m ? "var(--teal)" : "var(--border)",
              background: filter === m ? "rgba(0,201,167,0.15)" : "transparent",
              color: filter === m ? "var(--teal)" : "var(--text-secondary)",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 500,
              transition: "all 0.2s",
            }}>
              {m === "All" ? "All" : `${modeIcon[m]} ${m}`}
            </button>
          ))}
        </div>

        {/* Records */}
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: "var(--text-secondary)" }}>No {filter !== "All" ? filter : ""} consultations found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((con, i) => {
              const followUpActive = new Date(con.followUpExpiry) > new Date()
              return (
                <div key={con.id} className="glass-card" style={{
                  padding: "22px 24px",
                  border: `1px solid ${modeColor[con.mode]}25`,
                  animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 20 }}>{modeIcon[con.mode]}</span>
                        <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{con.doctorName}</h3>
                        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: `${modeColor[con.mode]}20`, color: modeColor[con.mode], border: `1px solid ${modeColor[con.mode]}40` }}>
                          {con.mode} Consultation
                        </span>
                        {followUpActive && (
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: "rgba(0,201,167,0.1)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)" }}>
                            🔄 Follow-up Active
                          </span>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 10 }}>
                        {[
                          ["🔬 Specialty", con.specialty],
                          ["📅 Date", con.date],
                          ["💬 Reason", con.reason],
                          ["🔄 Follow-up till", con.followUpExpiry],
                        ].map(([label, val]) => (
                          <div key={label}>
                            <div style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: "0.83rem", fontWeight: 500 }}>{val}</div>
                          </div>
                        ))}
                      </div>

                      {con.rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Your rating:</span>
                          <span>{"⭐".repeat(con.rating)}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", color: "var(--teal)" }}>₹{con.fee}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginBottom: 10 }}>Paid</div>
                      {followUpActive && (
                        <button className="btn-secondary" onClick={() => navigate(`/patient/consult/${con.doctorId}`)}
                          style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
                          💬 Follow-up Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
