import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { getDoctorAppointments, updateAppointmentStatus, markAppointmentCompleted } from "../api/index"

export default function DoctorDashboard() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await getDoctorAppointments()
      if (Array.isArray(data)) setAppointments(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleStatus = async (id, status) => {
    await updateAppointmentStatus(id, status)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    showToast(status === "accepted" ? "✅ Appointment accepted!" : "❌ Appointment declined", status === "accepted" ? "success" : "danger")
  }

  const handleComplete = async (id) => {
    const res = await markAppointmentCompleted(id)
    if (res.message) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "completed" } : a))
      showToast("✅ Appointment completed! Consultation count updated.")
    }
  }

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter)

  const statusColor = {
    pending: "var(--amber)", accepted: "var(--teal)",
    rejected: "var(--coral)", completed: "#a78bfa", cancelled: "var(--text-dim)"
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />

      {toast && (
        <div style={{ position: "fixed", top: 88, right: 24, zIndex: 999, background: "var(--navy-light)", border: `1px solid ${toast.type === "danger" ? "rgba(255,107,107,0.4)" : "rgba(0,201,167,0.4)"}`, borderRadius: 10, padding: "14px 20px", fontSize: "0.88rem", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeInUp 0.3s ease forwards", color: toast.type === "danger" ? "var(--coral)" : "var(--teal)" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>Welcome back</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>{currentUser?.name || "Doctor"} 🩺</h1>
          </div>
          <button onClick={() => { logout(); navigate("/") }} className="btn-secondary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Logout</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total", val: appointments.length, color: "#a78bfa" },
            { label: "Pending", val: appointments.filter(a => a.status === "pending").length, color: "var(--amber)" },
            { label: "Accepted", val: appointments.filter(a => a.status === "accepted").length, color: "var(--teal)" },
            { label: "Completed", val: appointments.filter(a => a.status === "completed").length, color: "#61dafb" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", "pending", "accepted", "completed", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 16px", borderRadius: 100, border: "1px solid",
              borderColor: filter === f ? "var(--teal)" : "var(--border)",
              background: filter === f ? "rgba(0,201,167,0.15)" : "transparent",
              color: filter === f ? "var(--teal)" : "var(--text-secondary)",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem",
              textTransform: "capitalize", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        {/* Appointments */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)" }}>
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <p style={{ color: "var(--text-secondary)" }}>No {filter !== "all" ? filter : ""} appointments yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((apt, i) => (
              <div key={apt.id} className="glass-card" style={{ padding: "22px 24px", border: "1px solid var(--border)", animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{apt.patient_name}</h3>
                      <span style={{
                        padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700,
                        background: `${statusColor[apt.status]}20`, color: statusColor[apt.status],
                        border: `1px solid ${statusColor[apt.status]}40`, textTransform: "capitalize"
                      }}>
                        {apt.status}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8, marginBottom: 8 }}>
                      {[["🏥", apt.hospital_name], ["🔬", apt.specialty], ["📅", apt.date], ["⏰", apt.time], ["🩺", apt.disease]].map(([icon, val]) => val && (
                        <div key={icon} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{icon} {val}</div>
                      ))}
                    </div>
                    {apt.description && (
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontStyle: "italic" }}>"{apt.description}"</p>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, justifyContent: "center" }}>
                    {apt.status === "pending" && (
                      <>
                        <button className="btn-primary" onClick={() => handleStatus(apt.id, "accepted")}
                          style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                          ✅ Accept
                        </button>
                        <button className="btn-danger" onClick={() => handleStatus(apt.id, "rejected")}
                          style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                          ❌ Decline
                        </button>
                      </>
                    )}
                    {apt.status === "accepted" && (
                      <button onClick={() => handleComplete(apt.id)} style={{
                        padding: "10px 20px", fontSize: "0.85rem", borderRadius: 8,
                        border: "1px solid rgba(167,139,250,0.4)",
                        background: "rgba(167,139,250,0.15)",
                        color: "#a78bfa", cursor: "pointer", fontFamily: "inherit",
                        fontWeight: 700, transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.25)" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(167,139,250,0.15)" }}
                      >
                        ✓ Mark as Completed
                      </button>
                    )}
                    {apt.status === "completed" && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>✅</div>
                        <span style={{ fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>Completed</span>
                      </div>
                    )}
                    {apt.status === "rejected" && (
                      <span style={{ fontSize: "0.78rem", color: "var(--coral)", fontWeight: 600 }}>Declined</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
