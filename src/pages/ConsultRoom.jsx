import React, { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"

export default function ConsultRoom() {
  const { doctorId } = useParams()
  const { doctors, currentUser, addConsultation } = useApp()
  const navigate = useNavigate()
  const doctor = doctors.find(d => d.id === doctorId)
const [selectedUpi, setSelectedUpi] = useState(null)
  const [step, setStep] = useState("select") // select | pay | consult
  const [mode, setMode] = useState(null) // chat | video | audio
  const [paying, setPaying] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [callActive, setCallActive] = useState(false)
  const [callTime, setCallTime] = useState(0)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [ended, setEnded] = useState(false)
  const timerRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [callActive])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (step === "consult" && mode === "chat") {
      setTimeout(() => {
        setMessages([{ role: "doctor", text: `Hello! I'm ${doctor?.name}. How can I help you today?` }])
      }, 1000)
    }
    if (step === "consult" && (mode === "video" || mode === "audio")) {
      setTimeout(() => setCallActive(true), 1500)
    }
  }, [step, mode])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setStep("consult")
    }, 2000)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "patient", text: userMsg }])
    setTimeout(() => {
      const replies = [
        "I understand your concern. Can you tell me how long you've been experiencing this?",
        "That's helpful information. Have you taken any medication for this?",
        "Based on what you've described, I'd recommend some tests. Let me explain.",
        "This sounds manageable. I'll prescribe some medication and lifestyle changes.",
        "Please follow up with me in 3 days if symptoms don't improve.",
        "Make sure to stay hydrated and get adequate rest.",
      ]
      setMessages(prev => [...prev, { role: "doctor", text: replies[Math.floor(Math.random() * replies.length)] }])
    }, 1500)
  }

  const handleEndCall = () => {
    clearInterval(timerRef.current)
    setCallActive(false)
    setEnded(true)
    addConsultation({
      patientId: currentUser?.id || "P_NEW",
      patientName: currentUser?.name || "Patient",
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: new Date().toISOString().split("T")[0],
      mode: mode.charAt(0).toUpperCase() + mode.slice(1),
      reason: "Online consultation",
      fee: doctor.fee,
      followUpExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  if (!doctor) return null

  // ENDED screen
  if (ended) return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
        <div className="glass-card" style={{ maxWidth: 460, width: "100%", padding: 48, textAlign: "center", border: "1px solid rgba(0,201,167,0.3)", animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 8 }}>Consultation Complete!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.7 }}>
            Your consultation with <strong style={{ color: "var(--teal)" }}>{doctor.name}</strong> is complete.
          </p>
          <div style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: "0.85rem", color: "var(--teal)", fontWeight: 700, marginBottom: 8 }}>🔄 7-Day Free Follow-Up Activated!</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.6 }}>
              You can chat with {doctor.name} for free until <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString()}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/patient/records")}>View Medical Records</button>
            <button className="btn-secondary" onClick={() => navigate("/patient/consult")}>Back to Doctors</button>
          </div>
        </div>
      </div>
    </div>
  )

  // STEP 1 — Select mode
  if (step === "select") return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigate("/patient/consult")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back to Doctors
        </button>

        {/* Doctor info */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: 28, border: "1px solid rgba(0,201,167,0.2)", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "var(--navy)", fontWeight: 700 }}>
            {doctor.name.split(" ")[1]?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 2 }}>{doctor.name}</h3>
            <p style={{ color: "var(--teal)", fontSize: "0.85rem", marginBottom: 2 }}>{doctor.specialty}</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{doctor.experience} yrs exp · ⭐ {doctor.rating} · {doctor.totalConsultations.toLocaleString()} consultations</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--teal)" }}>₹{doctor.fee}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>+ 7 day follow-up</div>
          </div>
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 20 }}>Choose Consultation Type</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { id: "video", icon: "🎥", title: "Video Consultation", desc: "Face-to-face video call with the doctor", badge: "Most Popular", badgeColor: "var(--teal)" },
            { id: "audio", icon: "🎤", title: "Audio Consultation", desc: "Voice call — no camera needed", badge: null },
            { id: "chat", icon: "💬", title: "Chat Consultation", desc: "Text-based consultation, reply within minutes", badge: "Lowest Wait", badgeColor: "#a78bfa" },
          ].map(opt => (
            <div key={opt.id} onClick={() => setMode(opt.id)} style={{
              padding: "20px 24px", borderRadius: 12, border: "2px solid",
              borderColor: mode === opt.id ? "var(--teal)" : "var(--border)",
              background: mode === opt.id ? "rgba(0,201,167,0.08)" : "rgba(255,255,255,0.02)",
              cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ fontSize: 36 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{opt.title}</span>
                  {opt.badge && <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100, background: `${opt.badgeColor}20`, color: opt.badgeColor, border: `1px solid ${opt.badgeColor}40`, fontWeight: 600 }}>{opt.badge}</span>}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.83rem" }}>{opt.desc}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${mode === opt.id ? "var(--teal)" : "var(--border)"}`, background: mode === opt.id ? "var(--teal)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                {mode === opt.id && <span style={{ color: "var(--navy)", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => mode && setStep("pay")} disabled={!mode}
          style={{ width: "100%", padding: "14px", marginTop: 24, fontSize: "0.95rem", opacity: mode ? 1 : 0.5 }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  )

  // STEP 2 — Payment
  if (step === "pay") return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <button onClick={() => setStep("select")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{mode === "video" ? "🎥" : mode === "audio" ? "🎤" : "💬"}</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Confirm & Pay</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{mode?.charAt(0).toUpperCase() + mode?.slice(1)} consultation with {doctor.name}</p>
        </div>

        {/* Order Summary */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: 20, border: "1px solid rgba(0,201,167,0.2)" }}>
          {[
            ["Doctor", doctor.name],
            ["Specialty", doctor.specialty],
            ["Mode", mode?.charAt(0).toUpperCase() + mode?.slice(1) + " Consultation"],
            ["Consultation Fee", `₹${doctor.fee}`],
            ["Follow-up", "7 days free chat"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>{label}</span>
              <span style={{ fontWeight: 600, color: label === "Consultation Fee" ? "var(--teal)" : "var(--text-primary)" }}>{val}</span>
            </div>
          ))}
          <hr className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: "var(--teal)", fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem" }}>₹{doctor.fee}</span>
          </div>
        </div>

        {/* Select Payment Method */}
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Select Payment Method
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
          {[["💜", "PhonePe"], ["🔵", "GPay"], ["🔷", "Paytm"]].map(([icon, name]) => (
            <button key={name}
              onClick={() => setSelectedUpi(name)}
              style={{
                flex: 1, padding: "16px 8px", borderRadius: 10,
                border: `2px solid ${selectedUpi === name ? "var(--teal)" : "var(--border)"}`,
                background: selectedUpi === name ? "rgba(0,201,167,0.1)" : "rgba(255,255,255,0.03)",
                color: selectedUpi === name ? "var(--teal)" : "var(--text-primary)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                transition: "all 0.2s",
              }}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <span>{name}</span>
              {selectedUpi === name && (
                <span style={{ fontSize: "0.7rem", background: "var(--teal)", color: "var(--navy)", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
                  ✓ Selected
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Warning if nothing selected */}
        {!selectedUpi && (
          <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: "0.78rem", color: "var(--coral)", marginBottom: 16, marginTop: 8 }}>
            ⚠️ Please select a payment app above to continue
          </div>
        )}

        {selectedUpi && (
          <div style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: "0.78rem", color: "var(--teal)", marginBottom: 16, marginTop: 8 }}>
            ✅ Paying via {selectedUpi} · ₹{doctor.fee}
          </div>
        )}

        {/* Pay Button */}
        <button
          className="btn-primary"
          onClick={() => { if (!selectedUpi) return; handlePay() }}
          disabled={paying || !selectedUpi}
          style={{
            width: "100%", padding: "14px", fontSize: "0.95rem",
            opacity: !selectedUpi ? 0.5 : 1,
            cursor: !selectedUpi ? "not-allowed" : "pointer",
            marginTop: 4,
          }}
        >
          {paying ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Processing via {selectedUpi}...
            </span>
          ) : selectedUpi
            ? `Pay ₹${doctor.fee} via ${selectedUpi} →`
            : "Select a payment method first"
          }
        </button>
        <p style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 12 }}>🔒 Secured · Later powered by Razorpay</p>
      </div>
    </div>
  )
  // STEP 3 — Consult Room
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--navy)", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--navy-mid)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--navy)", fontWeight: 700 }}>
            {doctor.name.split(" ")[1]?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{doctor.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--teal)" }}>● {callActive ? "Connected" : "Connecting..."} · {mode?.charAt(0).toUpperCase() + mode?.slice(1)} Consultation</div>
          </div>
        </div>
        {(mode === "video" || mode === "audio") && callActive && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--teal)", fontSize: "1rem", fontWeight: 700 }}>
            {formatTime(callTime)}
          </div>
        )}
      </div>

      {/* CHAT mode */}
      {mode === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 700, width: "100%", margin: "0 auto", padding: "20px 24px" }}>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "patient" ? "flex-end" : "flex-start" }}>
                {msg.role === "doctor" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--navy)", fontWeight: 700, marginRight: 8, flexShrink: 0 }}>
                    {doctor.name.split(" ")[1]?.[0]}
                  </div>
                )}
                <div style={{
                  maxWidth: "70%", padding: "12px 16px",
                  borderRadius: msg.role === "patient" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "patient" ? "var(--teal)" : "rgba(255,255,255,0.08)",
                  color: msg.role === "patient" ? "var(--navy)" : "var(--text-primary)",
                  fontSize: "0.88rem", lineHeight: 1.6, fontWeight: msg.role === "patient" ? 500 : 400,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid var(--border)", marginTop: 16 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none" }} />
            <button onClick={sendMessage} style={{ background: "var(--teal)", border: "none", borderRadius: 10, width: 44, height: 44, cursor: "pointer", fontSize: 18, color: "var(--navy)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
            <button onClick={handleEndCall} style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.4)", borderRadius: 10, padding: "0 16px", cursor: "pointer", color: "var(--coral)", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600 }}>End</button>
          </div>
        </div>
      )}

      {/* VIDEO / AUDIO mode */}
      {(mode === "video" || mode === "audio") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {/* Main video area */}
          {mode === "video" && (
            <div style={{ width: "100%", maxWidth: 800, height: 420, background: videoOff ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(0,201,167,0.1), rgba(0,0,0,0.5))", borderRadius: 16, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              {!callActive ? (
                <div style={{ textAlign: "center" }}>
                  <div className="spinner" style={{ margin: "0 auto 16px" }} />
                  <p style={{ color: "var(--text-secondary)" }}>Connecting to {doctor.name}...</p>
                </div>
              ) : videoOff ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "var(--navy)", margin: "0 auto 12px" }}>
                    {doctor.name.split(" ")[1]?.[0]}
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Camera Off</p>
                </div>
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "var(--navy)", fontWeight: 700, margin: "0 auto 16px", animation: "pulse-teal 2s infinite" }}>
                      {doctor.name.split(" ")[1]?.[0]}
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{doctor.name}</p>
                    <p style={{ color: "var(--teal)", fontSize: "0.78rem" }}>Video Connected</p>
                  </div>
                  {/* Self preview */}
                  <div style={{ position: "absolute", bottom: 16, right: 16, width: 120, height: 80, background: "rgba(0,0,0,0.6)", borderRadius: 10, border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    You (Preview)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audio mode visual */}
          {mode === "audio" && (
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "var(--navy)", fontWeight: 700, margin: "0 auto 20px", animation: callActive ? "pulse-teal 1.5s infinite" : "none" }}>
                {doctor.name.split(" ")[1]?.[0]}
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", marginBottom: 6 }}>{doctor.name}</h3>
              <p style={{ color: callActive ? "var(--teal)" : "var(--text-secondary)", fontWeight: 600 }}>
                {callActive ? "🎤 Audio Connected" : "Connecting..."}
              </p>
              {callActive && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", color: "var(--teal)", marginTop: 8 }}>{formatTime(callTime)}</p>}
            </div>
          )}

          {/* Controls */}
          {callActive && (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button onClick={() => setMuted(!muted)} style={{
                width: 56, height: 56, borderRadius: "50%", border: "none",
                background: muted ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.1)",
                color: muted ? "var(--coral)" : "var(--text-primary)",
                cursor: "pointer", fontSize: 22, transition: "all 0.2s",
              }} title={muted ? "Unmute" : "Mute"}>
                {muted ? "🔇" : "🎤"}
              </button>

              {mode === "video" && (
                <button onClick={() => setVideoOff(!videoOff)} style={{
                  width: 56, height: 56, borderRadius: "50%", border: "none",
                  background: videoOff ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.1)",
                  color: videoOff ? "var(--coral)" : "var(--text-primary)",
                  cursor: "pointer", fontSize: 22, transition: "all 0.2s",
                }} title={videoOff ? "Turn on camera" : "Turn off camera"}>
                  {videoOff ? "📷" : "🎥"}
                </button>
              )}

              <button onClick={handleEndCall} style={{
                width: 64, height: 64, borderRadius: "50%", border: "none",
                background: "var(--coral)", color: "white",
                cursor: "pointer", fontSize: 24, transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(255,107,107,0.4)",
              }} title="End Call">
                📵
              </button>

              <button style={{
                width: 56, height: 56, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.1)", color: "var(--text-primary)",
                cursor: "pointer", fontSize: 22,
              }} title="Speaker">
                🔊
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
