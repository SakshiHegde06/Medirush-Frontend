import React, { useState } from "react"
import { useLang } from "../context/LangContext"

export default function RatingModal({ appointment, onSubmit, onClose }) {
  const { t } = useLang()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return
    setSubmitted(true)
    setTimeout(() => {
      onSubmit({ appointmentId: appointment.id, doctorId: appointment.doctorId, rating, feedback })
      onClose()
    }, 1500)
  }

  if (submitted) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div className="glass-card" style={{ padding: 48, textAlign: "center", maxWidth: 360, width: "90%", border: "1px solid rgba(255,217,61,0.3)", animation: "fadeInUp 0.3s ease forwards" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⭐</div>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 8 }}>Thank you!</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Your feedback helps other patients choose the right doctor.</p>
      </div>
    </div>
  )

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
      <div className="glass-card" style={{ maxWidth: 420, width: "100%", padding: 40, border: "1px solid rgba(255,217,61,0.3)", animation: "fadeInUp 0.3s ease forwards" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 4 }}>{t.rateDoctor}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>{appointment.doctorName} · {appointment.hospitalName}</p>

        {/* Stars */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {[1,2,3,4,5].map(star => (
            <button key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 40, transition: "transform 0.15s",
                transform: (hover || rating) >= star ? "scale(1.2)" : "scale(1)",
                filter: (hover || rating) >= star ? "none" : "grayscale(1) opacity(0.3)",
              }}
            >⭐</button>
          ))}
        </div>

        {rating > 0 && (
          <div style={{ textAlign: "center", marginBottom: 20, color: "var(--amber)", fontWeight: 600, fontSize: "0.9rem" }}>
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>{t.feedbackPlaceholder}</label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={t.feedbackPlaceholder}
            style={{ height: 90, resize: "none", lineHeight: 1.6, fontSize: "0.88rem", width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontFamily: "inherit", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={rating === 0}
            style={{ flex: 1, padding: "12px", opacity: rating === 0 ? 0.5 : 1, background: "linear-gradient(135deg, #ffd93d, #f5c800)", color: "var(--navy)" }}>
            {t.submitRating} →
          </button>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "12px 20px" }}>Skip</button>
        </div>
      </div>
    </div>
  )
}
