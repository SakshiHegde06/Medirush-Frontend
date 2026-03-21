import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { getDoctorAppointments, updateAppointmentStatus, markAppointmentCompleted, getDoctorConsultations, saveDoctorSlots } from "../api/index"
const ALL_SLOTS = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","2:00 PM","2:30 PM","3:00 PM",
  "3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM"
]

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

export default function DoctorDashboard() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [filter, setFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("appointments")
  const [availableSlots, setAvailableSlots] = useState(() => {
    const saved = localStorage.getItem("doctorSlots")
    return saved ? JSON.parse(saved) : {
      Monday: ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","2:00 PM","2:30 PM","3:00 PM"],
      Tuesday: ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","2:00 PM","2:30 PM","3:00 PM"],
      Wednesday: ["9:00 AM","9:30 AM","10:00 AM","2:00 PM","2:30 PM"],
      Thursday: ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","2:00 PM","2:30 PM","3:00 PM"],
      Friday: ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","2:00 PM","2:30 PM"],
      Saturday: ["9:00 AM","9:30 AM","10:00 AM"],
      Sunday: [],
    }
  })
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [slotsSaved, setSlotsSaved] = useState(false)

  useEffect(() => { fetchAppointments(); fetchConsultations() }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await getDoctorAppointments()
      if (Array.isArray(data)) setAppointments(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const fetchConsultations = async () => {
    try {
      const data = await getDoctorConsultations()
      if (Array.isArray(data)) setConsultations(data)
    } catch (err) { console.error(err) }
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
      showToast("✅ Appointment completed!")
    }
  }

  const toggleSlot = (slot) => {
    setAvailableSlots(prev => {
      const current = prev[selectedDay] || []
      const updated = current.includes(slot)
        ? current.filter(s => s !== slot)
        : [...current, slot].sort((a, b) => ALL_SLOTS.indexOf(a) - ALL_SLOTS.indexOf(b))
      return { ...prev, [selectedDay]: updated }
    })
    setSlotsSaved(false)
  }
const saveSlots = async () => {
  localStorage.setItem("doctorSlots", JSON.stringify(availableSlots))
  try {
    await saveDoctorSlots(availableSlots)
    showToast("✅ Availability saved to database!")
  } catch (err) {
    showToast("⚠️ Saved locally only", "danger")
  }
  setSlotsSaved(true)
  setTimeout(() => setSlotsSaved(false), 3000)
}

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter)

  const statusColor = {
    pending: "var(--amber)", accepted: "var(--teal)",
    rejected: "var(--coral)", completed: "#a78bfa", cancelled: "var(--text-dim)"
  }

  const modeIcon = { Video: "🎥", Audio: "🎤", Chat: "💬" }
  const modeColor = { Video: "#00c9a7", Audio: "#a78bfa", Chat: "#ffd93d" }

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split("T")[0]
    return a.date === today && (a.status === "accepted" || a.status === "pending")
  })

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Appointments", val: appointments.length, color: "#a78bfa" },
            { label: "Pending", val: appointments.filter(a => a.status === "pending").length, color: "var(--amber)" },
            { label: "Accepted", val: appointments.filter(a => a.status === "accepted").length, color: "var(--teal)" },
            { label: "Completed", val: appointments.filter(a => a.status === "completed").length, color: "#61dafb" },
            { label: "Online Consults", val: consultations.length, color: "#ffd93d" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.72rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's schedule */}
        {todayAppointments.length > 0 && (
          <div style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--teal)", marginBottom: 12 }}>📅 Today's Schedule ({todayAppointments.length} patients)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {todayAppointments.map(apt => (
                <div key={apt.id} style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: "0.82rem" }}>
                  <span style={{ fontWeight: 600 }}>{apt.time}</span> · {apt.patient_name}
                  <span style={{ marginLeft: 8, padding: "2px 6px", borderRadius: 4, background: apt.status === "accepted" ? "rgba(0,201,167,0.2)" : "rgba(255,217,61,0.2)", color: apt.status === "accepted" ? "var(--teal)" : "var(--amber)", fontSize: "0.72rem" }}>{apt.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content", flexWrap: "wrap" }}>
          {[
            { key: "appointments", label: "📅 Appointments" },
            { key: "consultations", label: "💬 Online Consultations" },
            { key: "slots", label: "🕐 Manage Availability" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "8px 20px", borderRadius: 7, border: "none", fontFamily: "inherit",
              background: activeTab === t.key ? "#a78bfa" : "transparent",
              color: activeTab === t.key ? "white" : "var(--text-secondary)",
              cursor: "pointer", fontSize: "0.85rem", fontWeight: activeTab === t.key ? 700 : 500,
              transition: "all 0.2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div>
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
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)" }}>
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Loading...
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
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: `${statusColor[apt.status]}20`, color: statusColor[apt.status], border: `1px solid ${statusColor[apt.status]}40`, textTransform: "capitalize" }}>
                            {apt.status}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                          {[["🏥", apt.hospital_name], ["🔬", apt.specialty], ["📅", apt.date], ["⏰", apt.time], ["🩺", apt.disease]].map(([icon, val]) => val && (
                            <div key={icon} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{icon} {val}</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, justifyContent: "center" }}>
                        {apt.status === "pending" && (
                          <>
                            <button className="btn-primary" onClick={() => handleStatus(apt.id, "accepted")} style={{ padding: "8px 20px", fontSize: "0.82rem" }}>✅ Accept</button>
                            <button className="btn-danger" onClick={() => handleStatus(apt.id, "rejected")} style={{ padding: "8px 20px", fontSize: "0.82rem" }}>❌ Decline</button>
                          </>
                        )}
                        {apt.status === "accepted" && (
                          <button onClick={() => handleComplete(apt.id)} style={{ padding: "10px 20px", fontSize: "0.85rem", borderRadius: 8, border: "1px solid rgba(167,139,250,0.4)", background: "rgba(167,139,250,0.15)", color: "#a78bfa", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, transition: "all 0.2s" }}>
                            ✓ Mark Complete
                          </button>
                        )}
                        {apt.status === "completed" && <span style={{ fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>✅ Completed</span>}
                        {apt.status === "rejected" && <span style={{ fontSize: "0.78rem", color: "var(--coral)", fontWeight: 600 }}>❌ Declined</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONLINE CONSULTATIONS TAB */}
        {activeTab === "consultations" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 20 }}>
              Online Consultations
            </h2>
            {consultations.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                <p style={{ color: "var(--text-secondary)" }}>No online consultations yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {consultations.map((con, i) => {
                  const followUpActive = con.follow_up_expiry && new Date(con.follow_up_expiry) > new Date()
                  const color = modeColor[con.mode] || "var(--teal)"
                  return (
                    <div key={con.id} className="glass-card" style={{ padding: "20px 24px", border: `1px solid ${color}25`, animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 20 }}>{modeIcon[con.mode] || "🩺"}</span>
                            <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>{con.patient_name}</h3>
                            <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, background: `${color}20`, color, border: `1px solid ${color}40` }}>
                              {con.mode} Consultation
                            </span>
                            {followUpActive && (
                              <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", background: "rgba(0,201,167,0.1)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)" }}>
                                🔄 Follow-up Active till {new Date(con.follow_up_expiry).toLocaleDateString("en-IN")}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                            {[["🔬", con.specialty], ["📅", new Date(con.created_at).toLocaleDateString("en-IN")], ["💰", `Rs.${con.fee}`], ["💬", con.reason]].map(([icon, val]) => val && (
                              <span key={icon} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{icon} {val}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* SLOTS TAB */}
        {activeTab === "slots" && (
          <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 6 }}>Manage Your Availability</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Select which time slots you are available each day.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {DAYS.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)} style={{
                  padding: "8px 18px", borderRadius: 100, border: "1px solid",
                  borderColor: selectedDay === day ? "#a78bfa" : "var(--border)",
                  background: selectedDay === day ? "rgba(167,139,250,0.15)" : "transparent",
                  color: selectedDay === day ? "#a78bfa" : "var(--text-secondary)",
                  cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 500,
                  transition: "all 0.2s",
                }}>
                  {day} {availableSlots[day]?.length > 0 ? `(${availableSlots[day].length})` : "(Off)"}
                </button>
              ))}
            </div>
            <div className="glass-card" style={{ padding: "24px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{selectedDay} Slots</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setAvailableSlots(prev => ({ ...prev, [selectedDay]: [...ALL_SLOTS] }))} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid var(--teal)", background: "rgba(0,201,167,0.1)", color: "var(--teal)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem" }}>Select All</button>
                  <button onClick={() => setAvailableSlots(prev => ({ ...prev, [selectedDay]: [] }))} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem" }}>Clear All</button>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ALL_SLOTS.map(slot => {
                  const selected = availableSlots[selectedDay]?.includes(slot)
                  return (
                    <button key={slot} onClick={() => toggleSlot(slot)} style={{
                      padding: "8px 16px", borderRadius: 8, border: "1px solid",
                      borderColor: selected ? "#a78bfa" : "var(--border)",
                      background: selected ? "rgba(167,139,250,0.15)" : "transparent",
                      color: selected ? "#a78bfa" : "var(--text-secondary)",
                      cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem",
                      transition: "all 0.2s", fontWeight: selected ? 600 : 400,
                    }}>
                      {selected ? "✓ " : ""}{slot}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="glass-card" style={{ padding: "24px", marginBottom: 20 }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Weekly Overview</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DAYS.map(day => (
                  <div key={day} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 100, fontSize: "0.82rem", fontWeight: 600, color: selectedDay === day ? "#a78bfa" : "var(--text-secondary)" }}>{day}</div>
                    {availableSlots[day]?.length === 0 ? (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontStyle: "italic" }}>Day off</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {availableSlots[day]?.map(slot => (
                          <span key={slot} style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa", fontSize: "0.72rem" }}>{slot}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={saveSlots} style={{ padding: "12px 32px", fontSize: "0.95rem", background: "#a78bfa" }}>
              {slotsSaved ? "✅ Saved!" : "Save Availability →"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

