import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getAdminStats, adminGetAllDoctors, verifyDoctor, removeDoctor, getAllAppointments, getAllPatients } from "../api/index"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("doctors")
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [stats, setStats] = useState({ total_doctors: 0, pending_doctors: 0, total_patients: 0, total_appointments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [d, a, p, s] = await Promise.all([adminGetAllDoctors(), getAllAppointments(), getAllPatients(), getAdminStats()])
      if (Array.isArray(d)) setDoctors(d)
      if (Array.isArray(a)) setAppointments(a)
      if (Array.isArray(p)) setPatients(p)
      if (s.total_doctors !== undefined) setStats(s)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleVerify = async (doc) => {
    await verifyDoctor(doc.id)
    setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, status: "verified" } : d))
    setStats(prev => ({ ...prev, pending_doctors: prev.pending_doctors - 1 }))
    showToast(`✅ ${doc.name} has been verified`)
  }

  const handleRemove = async (doc) => {
    await removeDoctor(doc.id)
    setDoctors(prev => prev.filter(d => d.id !== doc.id))
    setConfirmRemove(null)
    showToast(`Removed ${doc.name} from the platform`, "danger")
  }

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.license_no?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  )

  const pendingDocs = doctors.filter(d => d.status === "pending")

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%)", top: 0, left: 0 }} />
      <Navbar />

      {toast && (
        <div style={{ position: "fixed", top: 88, right: 24, zIndex: 999, background: "var(--navy-light)", border: `1px solid ${toast.type === "danger" ? "rgba(255,107,107,0.4)" : "rgba(0,201,167,0.4)"}`, borderRadius: 10, padding: "14px 20px", fontSize: "0.88rem", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeInUp 0.3s ease forwards", color: toast.type === "danger" ? "var(--coral)" : "var(--teal)" }}>
          {toast.msg}
        </div>
      )}

      {confirmRemove && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 998 }}>
          <div className="glass-card" style={{ padding: 40, maxWidth: 380, width: "90%", textAlign: "center", border: "1px solid rgba(255,107,107,0.3)", animation: "fadeInUp 0.3s ease forwards" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", marginBottom: 10 }}>Remove Doctor?</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.7 }}>
              Are you sure you want to remove <strong>{confirmRemove.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-danger" onClick={() => handleRemove(confirmRemove)} style={{ padding: "10px 24px" }}>Yes, Remove</button>
              <button className="btn-secondary" onClick={() => setConfirmRemove(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 36, animation: "fadeInUp 0.5s ease forwards" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 4 }}>Administrator</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem" }}>Admin Dashboard 🛡️</h1>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)", marginBottom: 32 }}>
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            Loading data from database...
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Doctors", val: stats.total_doctors, color: "#a78bfa", icon: "🩺" },
                { label: "Pending Verification", val: stats.pending_doctors, color: "#ffd93d", icon: "⏳" },
                { label: "Total Patients", val: stats.total_patients, color: "#00c9a7", icon: "👤" },
                { label: "Total Appointments", val: stats.total_appointments, color: "#ff6b6b", icon: "📅" },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: "20px", border: `1px solid ${s.color}25` }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: s.color }}>{s.val}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content" }}>
              {[{ key: "doctors", label: "Doctor Management" }, { key: "appointments", label: "All Appointments" }, { key: "patients", label: "Patient Records" }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 20px", borderRadius: 7, border: "none", fontFamily: "inherit", background: tab === t.key ? "#ff6b6b" : "transparent", color: tab === t.key ? "white" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: tab === t.key ? 700 : 500, transition: "all 0.2s" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "doctors" && (
              <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, license, specialty..."
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", marginBottom: 20 }} />

                {pendingDocs.length > 0 && (
                  <div style={{ background: "rgba(255,217,61,0.06)", border: "1px solid rgba(255,217,61,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: "0.85rem", color: "var(--amber)" }}>
                    ⚠️ <strong>{pendingDocs.length} doctor{pendingDocs.length !== 1 ? "s" : ""} awaiting license verification</strong>
                  </div>
                )}

                {filteredDoctors.length === 0 ? (
                  <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
                    <p style={{ color: "var(--text-secondary)" }}>No doctors registered yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredDoctors.map((doc, i) => (
                      <div key={doc.id} className="glass-card" style={{ padding: "20px 24px", border: `1px solid ${doc.status === "pending" ? "rgba(255,217,61,0.25)" : "var(--border)"}`, animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: doc.status === "verified" ? "rgba(0,201,167,0.15)" : "rgba(255,217,61,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🩺</div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{doc.name}</span>
                                <span className={`badge badge-${doc.status === "verified" ? "success" : "warning"}`}>
                                  {doc.status === "verified" ? "✓ Verified" : "⏳ Pending"}
                                </span>
                              </div>
                              <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: 2 }}>{doc.qualification} · {doc.specialty}</div>
                              <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>🏥 {doc.hospital}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>License No.</div>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: doc.status === "verified" ? "var(--teal)" : "var(--amber)" }}>{doc.license_no}</div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              {doc.status === "pending" && (
                                <button className="btn-primary" onClick={() => handleVerify(doc)} style={{ padding: "8px 18px", fontSize: "0.82rem" }}>Verify</button>
                              )}
                              <button className="btn-danger" onClick={() => setConfirmRemove(doc)} style={{ padding: "8px 16px" }}>Remove</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "appointments" && (
              <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
                {appointments.length === 0 ? (
                  <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    <p style={{ color: "var(--text-secondary)" }}>No appointments yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {appointments.map((apt, i) => (
                      <div key={apt.id} className="glass-card" style={{ padding: "20px 24px", animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{apt.patient_name} → {apt.doctor_name}</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "0.83rem", marginBottom: 4 }}>{apt.hospital_name} · {apt.specialty} · {apt.date} at {apt.time}</div>
                            <div style={{ color: "var(--teal)", fontSize: "0.82rem", fontWeight: 600 }}>{apt.disease}</div>
                          </div>
                          <span className={`badge badge-${apt.status === "accepted" ? "success" : apt.status === "rejected" ? "danger" : "warning"}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "patients" && (
              <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
                {patients.length === 0 ? (
                  <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                    <p style={{ color: "var(--text-secondary)" }}>No patients registered yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {patients.map((p, i) => (
                      <div key={p.id} className="glass-card" style={{ padding: "24px", animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,201,167,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{p.name}</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{p.email} · {p.phone}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
