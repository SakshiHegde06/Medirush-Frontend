import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"

export default function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useSocket()
  const navigate = useNavigate()
  const [ringing, setRinging] = useState(0)

  useEffect(() => {
    if (!incomingCall) return
    const interval = setInterval(() => setRinging(r => r + 1), 1000)
    return () => clearInterval(interval)
  }, [incomingCall])

  if (!incomingCall) return null

  const modeIcon = { Video: "🎥", Audio: "🎤", Chat: "💬" }

  const handleAccept = () => {
    acceptCall({ patientId: incomingCall.patientId, roomId: incomingCall.roomId })
    navigate(`/patient/consult/${incomingCall.doctorId}`)
  }

  const handleReject = () => {
    rejectCall({ patientId: incomingCall.patientId, roomId: incomingCall.roomId })
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(10px)" }}>
      <div style={{ background: "var(--navy-light)", border: "1px solid rgba(0,201,167,0.4)", borderRadius: 24, padding: 48, maxWidth: 380, width: "90%", textAlign: "center", animation: "fadeInUp 0.4s ease forwards" }}>

        {/* Animated ring */}
        <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 24px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(0,201,167,0.4)", animation: "pulse-ring 1.5s infinite", transform: "scale(1.3)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(0,201,167,0.3)", animation: "pulse-ring 1.5s infinite 0.5s", transform: "scale(1.6)" }} />
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
            {modeIcon[incomingCall.mode] || "📞"}
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--teal)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Incoming {incomingCall.mode} Call
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 8 }}>
          {incomingCall.patientName}
        </h2>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 8 }}>
          is requesting a {incomingCall.mode?.toLowerCase()} consultation
        </p>

        <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>
          Ringing... {ringing}s
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={handleReject} style={{
            width: 72, height: 72, borderRadius: "50%", border: "none",
            background: "var(--coral)", color: "white", cursor: "pointer",
            fontSize: 28, boxShadow: "0 4px 20px rgba(255,107,107,0.4)",
            transition: "all 0.2s",
          }}>
            📵
          </button>
          <button onClick={handleAccept} style={{
            width: 72, height: 72, borderRadius: "50%", border: "none",
            background: "var(--teal)", color: "var(--navy)", cursor: "pointer",
            fontSize: 28, boxShadow: "0 4px 20px rgba(0,201,167,0.4)",
            transition: "all 0.2s",
          }}>
            📞
          </button>
        </div>

        <p style={{ color: "var(--text-dim)", fontSize: "0.72rem", marginTop: 16 }}>
          📵 Decline &nbsp;&nbsp; 📞 Accept
        </p>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
