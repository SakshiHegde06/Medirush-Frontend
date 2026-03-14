import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { registerPatient, loginPatient } from "../api/index"

export default function PatientAuth() {
  const [tab, setTab] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [otpStep, setOtpStep] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpTimer, setOtpTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [apiError, setApiError] = useState("")
  const timerRef = useRef(null)
  const { login } = useApp()
  const navigate = useNavigate()

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }))
    setApiError("")
  }

  const validate = () => {
    const e = {}
    if (tab === "signup" && !form.name.trim()) e.name = "Full name is required"
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email"
    if (tab === "signup" && !form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter a valid 10-digit Indian mobile number"
    if (form.password.length < 6) e.password = "Password must be at least 6 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const startOtpTimer = () => {
    setOtpTimer(30)
    setCanResend(false)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setApiError("")
    try {
      if (tab === "signup") {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        setGeneratedOtp(otp)
        setOtpStep(true)
        startOtpTimer()
        setLoading(false)
      } else {
        const res = await loginPatient({ email: form.email, password: form.password })
        if (res.token) {
          localStorage.setItem("token", res.token)
          login("patient", res.user)
          navigate("/patient/dashboard")
        } else {
          setApiError(res.message || "Login failed")
        }
      }
    } catch {
      setApiError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (enteredOtp !== generatedOtp) {
      setOtpError("❌ Incorrect OTP. Please try again.")
      setEnteredOtp("")
      return
    }
    setLoading(true)
    try {
      const res = await registerPatient({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      if (res.token) {
        localStorage.setItem("token", res.token)
        login("patient", res.user)
        navigate("/patient/dashboard")
      } else {
        setOtpStep(false)
        setApiError(res.message || "Registration failed")
      }
    } catch {
      setApiError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  const handleResendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    setEnteredOtp("")
    setOtpError("")
    startOtpTimer()
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 70%)", top: -150, right: -100 }} />
      <Navbar />

      {otpStep && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(8px)" }}>
          <div className="glass-card" style={{ padding: 40, maxWidth: 400, width: "90%", textAlign: "center", border: "1px solid rgba(0,201,167,0.3)", animation: "fadeInUp 0.4s ease forwards" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", marginBottom: 8 }}>Verify Your Number</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 16 }}>
              OTP sent to <strong style={{ color: "var(--teal)" }}>+91 {form.phone}</strong>
            </p>
            <div style={{ background: "rgba(0,201,167,0.08)", border: "1px dashed rgba(0,201,167,0.4)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: "0.78rem", color: "var(--teal)" }}>
              🔧 Demo OTP: <strong style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", letterSpacing: 4 }}>{generatedOtp}</strong>
            </div>
            <input value={enteredOtp} onChange={e => { setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError("") }}
              placeholder="______" maxLength={6}
              style={{ width: "100%", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", letterSpacing: 10, background: "rgba(255,255,255,0.05)", border: `1px solid ${otpError ? "var(--coral)" : "var(--border)"}`, borderRadius: 10, padding: "14px", color: "var(--text-primary)", outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
            {otpError && <p style={{ color: "var(--coral)", fontSize: "0.8rem", marginBottom: 10 }}>{otpError}</p>}
            <button className="btn-primary" onClick={handleVerifyOtp} disabled={enteredOtp.length !== 6 || loading}
              style={{ width: "100%", padding: "13px", fontSize: "0.95rem", marginBottom: 16, opacity: enteredOtp.length !== 6 ? 0.5 : 1 }}>
              {loading ? "Creating Account..." : "Verify & Continue →"}
            </button>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 12 }}>
              {canResend
                ? <button onClick={handleResendOtp} style={{ background: "none", border: "none", color: "var(--teal)", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.82rem" }}>🔄 Resend OTP</button>
                : <span>Resend in <strong style={{ color: "var(--teal)", fontFamily: "'JetBrains Mono', monospace" }}>{otpTimer}s</strong></span>
              }
            </div>
            <button onClick={() => { setOtpStep(false); setEnteredOtp(""); setOtpError("") }}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>
              ← Change number
            </button>
          </div>
        </div>
      )}

      <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeInUp 0.5s ease forwards" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Back to Home
          </button>
          <div className="glass-card" style={{ padding: "40px", border: "1px solid rgba(0,201,167,0.2)" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Patient Portal</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                {tab === "login" ? "Welcome back! Sign in to your account." : "Create an account to get started."}
              </p>
            </div>
            <div className="tabs" style={{ marginBottom: 28 }}>
              <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErrors({}); setApiError("") }}>Sign In</button>
              <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setErrors({}); setApiError("") }}>Sign Up</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tab === "signup" && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ananya Sharma" />
                  {errors.name && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.name}</span>}
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@gmail.com" />
                {errors.email && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.email}</span>}
              </div>
              {tab === "signup" && (
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.phone}</span>}
                </div>
              )}
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
                {errors.password && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.password}</span>}
              </div>
              {apiError && (
                <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--coral)", fontSize: "0.83rem" }}>
                  ⚠️ {apiError}
                </div>
              )}
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}
                style={{ marginTop: 8, padding: "14px", fontSize: "0.95rem", width: "100%" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      {tab === "login" ? "Signing in..." : "Processing..."}
                    </span>
                  : tab === "login" ? "Sign In →" : "Create Account →"
                }
              </button>
              {tab === "login" && (
                <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", color: "var(--teal)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem" }}>Sign up here</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
