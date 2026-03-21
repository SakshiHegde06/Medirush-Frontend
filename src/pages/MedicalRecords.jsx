import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getMyConsultations, getPatientStats } from "../api/index"

export default function MedicalRecords() {
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [stats, setStats] = useState({ total_spent: 0, total_consultations: 0, total_appointments: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cons, st] = await Promise.all([getMyConsultations(), getPatientStats()])
      if (Array.isArray(cons)) setConsultations(cons)
      if (st.total_spent !== undefined) setStats(st)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const modes = ["All", "Video", "Audio", "Chat"]
  const filtered = filter === "All" ? consultations : consultations.filter(c => c.mode === filter)
  const modeIcon = { Video: "🎥", Audio: "🎤", Chat: "💬" }
  const modeColor = { Video: "#00c9a7", Audio: "#a78bfa", Chat: "#ffd93d" }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)", top: 0, left: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigate("/patient/dashboard")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          Back to Dashboard
        </button>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 8 }}>Medical Records</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Your complete consultation history</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total Consultations", val: stats.total_consultations, color: "var(--teal)", icon: "🩺" },
            { label: "Total Appointments", val: stats.total_appointments, color: "#a78bfa", icon: "📅" },
            { label: "Total Spent", val: `Rs.${Number(stats.total_spent || 0).toFixed(0)}`, color: "#ffd93d", icon: "💰" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
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
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)" }}>
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Loading records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No {filter !== "All" ? filter : ""} consultations found.</p>
            <button className="btn-primary" onClick={() => navigate("/patient/consult")} style={{ padding: "10px 24px" }}>
              Start a Consultation
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((con, i) => {
              const followUpActive = con.follow_up_expiry && new Date(con.follow_up_expiry) > new Date()
              const color = modeColor[con.mode] || "var(--teal)"
              return (
                <div key={con.id} className="glass-card" style={{ padding: "22px 24px", border: `1px solid ${color}25`, animation: `fadeInUp 0.4s ease ${i * 0.07}s both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 20 }}>{modeIcon[con.mode] || "🩺"}</span>
                        <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{con.doctor_name}</h3>
                        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: `${color}20`, color, border: `1px solid ${color}40` }}>
                          {con.mode} Consultation
                        </span>
                        {followUpActive && (
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: "rgba(0,201,167,0.1)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)" }}>
                            🔄 Follow-up Active
                          </span>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 8 }}>
                        {[
                          ["🔬 Specialty", con.specialty],
                          ["📅 Date", new Date(con.created_at).toLocaleDateString("en-IN")],
                          ["💬 Reason", con.reason],
                          ["🔄 Follow-up till", con.follow_up_expiry ? new Date(con.follow_up_expiry).toLocaleDateString("en-IN") : "N/A"],
                        ].map(([label, val]) => (
                          <div key={label}>
                            <div style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: "0.83rem", fontWeight: 500 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", color: "var(--teal)" }}>Rs.{con.fee}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginBottom: 10 }}>Paid</div>
                      {followUpActive && (
                        <button className="btn-secondary" onClick={() => navigate(`/patient/consult/${con.doctor_id}`)}
                          style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
                          💬 Follow-up
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


