import React, { useState } from "react"
import { submitRating } from "../api/index"

export default function RatingModal({ appointment, onClose, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating"); return }
    setLoading(true)
    try {
      const res = await submitRating({
        doctor_id: appointment.doctor_id,
        appointment_id: appointment.id,
        rating,
        feedback,
      })
      if (res.message === "Rating submitted successfully") {
        onSuccess()
        onClose()
      } else {
        setError(res.message || "Failed to submit rating")
      }
    } catch (err) {
      setError("Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(8px)" }}>
      <div className="glass-card" style={{ maxWidth: 440, width: "90%", padding: 40, border: "1px solid rgba(0,201,167,0.3)", animation: "fadeInUp 0.4s ease forwards" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", marginBottom: 6 }}>Rate Your Doctor</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            How was your experience with <strong style={{ color: "var(--teal)" }}>{appointment.doctor_name}</strong>?
          </p>
        </div>

        {/* Star rating */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 40, transition: "transform 0.15s",
                transform: (hover || rating) >= star ? "scale(1.2)" : "scale(1)",
                filter: (hover || rating) >= star ? "brightness(1)" : "brightness(0.3)",
              }}>
              ⭐
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ color: "var(--teal)", fontWeight: 700, fontSize: "0.9rem" }}>
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
            </span>
          </div>
        )}

        {/* Feedback */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Your feedback (optional)</label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
            placeholder="Share your experience with this doctor..."
            rows={3}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", resize: "vertical" }} />
        </div>

        {error && (
          <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--coral)", fontSize: "0.83rem", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: "12px" }}>
            Skip
          </button>
          <button onClick={handleSubmit} disabled={loading || rating === 0} className="btn-primary"
            style={{ flex: 1, padding: "12px", opacity: rating === 0 ? 0.5 : 1 }}>
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  )
}
