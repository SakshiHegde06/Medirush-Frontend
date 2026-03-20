import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"

const specialties = ["All", "General Medicine", "Cardiology", "Gastroenterology", "Neurology", "Pulmonology", "Dermatology", "Psychiatry", "Urology", "Dermatology", "Musculoskeletal", "Endocrinology", "Infectious Disease"]

export default function OnlineConsult() {
  const { doctors } = useApp()
  const navigate = useNavigate()
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  const verifiedDoctors = doctors.filter(d => d.status === "verified")

  const filtered = verifiedDoctors
    .filter(d => selectedSpecialty === "All" || d.specialty === selectedSpecialty)
    .filter(d =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
      if (sortBy === "fee") return parseFloat(a.fee || 0) - parseFloat(b.fee || 0)
      return (b.total_consultations || 0) - (a.total_consultations || 0)
    })

  const isAvailable = (doc) => doc.available === 1 || doc.available === true

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 40, animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 20, fontSize: "0.8rem", color: "var(--teal)", fontWeight: 600 }}>
            ✦ ONLINE CONSULTATION
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Consult a Doctor <span style={{ color: "var(--teal)" }}>Online</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: 500 }}>
            Chat, audio or video consultation with verified specialists. Includes <strong style={{ color: "var(--teal)" }}>7-day free follow-up</strong> after every consultation.
          </p>
        </div>

        {/* Features bar */}
        <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          {[["💬", "Chat Consult", "Text based, anytime"], ["🎥", "Video Consult", "Face to face online"], ["🎤", "Audio Consult", "Voice call with doctor"], ["🔄", "7-Day Follow Up", "Free post consultation"]].map(([icon, title, sub]) => (
            <div key={title} className="glass-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{title}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctor or specialty..."
            style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none" }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{
              background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: 8,
              padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit",
              fontSize: "0.85rem", outline: "none", cursor: "pointer",
              appearance: "none", WebkitAppearance: "none", paddingRight: 36,
            }}>
            <option value="rating" style={{ background: "var(--navy-mid)" }}>Sort: Top Rated</option>
            <option value="fee" style={{ background: "var(--navy-mid)" }}>Sort: Lowest Fee</option>
            <option value="consultations" style={{ background: "var(--navy-mid)" }}>Sort: Most Consulted</option>
          </select>
        </div>

        {/* Specialty filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {specialties.map(s => (
            <button key={s} onClick={() => setSelectedSpecialty(s)} style={{
              padding: "6px 16px", borderRadius: 100, border: "1px solid",
              borderColor: selectedSpecialty === s ? "var(--teal)" : "var(--border)",
              background: selectedSpecialty === s ? "rgba(0,201,167,0.15)" : "transparent",
              color: selectedSpecialty === s ? "var(--teal)" : "var(--text-secondary)",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500,
              transition: "all 0.2s",
            }}>{s}</button>
          ))}
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 16 }}>
            Showing <strong style={{ color: "var(--teal)" }}>{filtered.length}</strong> doctors
          </p>
        )}

        {/* Doctor cards */}
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🩺</div>
            <p style={{ color: "var(--text-secondary)" }}>No doctors found. Try a different specialty or search term.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((doc, i) => (
              <div key={doc.id} className="glass-card" style={{
                padding: "24px", border: "1px solid var(--border)",
                animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,201,167,0.3)"; e.currentTarget.style.transform = "translateX(4px)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateX(0)" }}
              >
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

                  {/* Avatar */}
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "var(--navy)", fontWeight: 700, flexShrink: 0 }}>
                    {doc.name?.split(" ")[1]?.[0] || doc.name?.[0] || "D"}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{doc.name}</h3>
                      <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>✓ Verified</span>
                      {isAvailable(doc)
                        ? <span style={{ fontSize: "0.72rem", color: "var(--teal)", background: "rgba(0,201,167,0.1)", padding: "2px 8px", borderRadius: 100 }}>● Available Now</span>
                        : <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 100 }}>○ Busy</span>
                      }
                    </div>
                    <p style={{ color: "var(--teal)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>{doc.specialty}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 8 }}>
                      {doc.qualification} · {doc.experience} yrs exp · {doc.hospital}
                    </p>
                    {doc.about && (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 10, lineHeight: 1.6 }}>{doc.about}</p>
                    )}

                    {/* Languages */}
                    {doc.languages && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {doc.languages.split(",").map(l => (
                          <span key={l} style={{ padding: "2px 10px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                            🗣️ {l.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#ffd93d" }}>
                          {"⭐".repeat(Math.floor(parseFloat(doc.rating || 0)))} {parseFloat(doc.rating || 0).toFixed(1)}
                        </div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>Rating</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "var(--teal)" }}>
                          {(doc.total_consultations || doc.totalConsultations || 0).toLocaleString()}
                        </div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>Consultations</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#a78bfa" }}>
                          {doc.experience} yrs
                        </div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>Experience</div>
                      </div>
                    </div>
                  </div>

                  {/* Right — Fee + CTA */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 2 }}>Consultation Fee</div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "var(--teal)" }}>₹{doc.fee}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: 2 }}>+ 7 day free follow-up</div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/patient/consult/${doc.id}`)}
                      disabled={!isAvailable(doc)}
                      style={{ padding: "10px 24px", fontSize: "0.88rem", opacity: isAvailable(doc) ? 1 : 0.5, cursor: isAvailable(doc) ? "pointer" : "not-allowed" }}
                    >
                      {isAvailable(doc) ? "Consult Now →" : "Unavailable"}
                    </button>
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
