import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { registerDoctor, loginDoctor } from "../api/index"

const LANGUAGE_OPTIONS = ["English", "Hindi", "Kannada", "Telugu", "Tamil", "Malayalam", "Marathi", "Gujarati", "Punjabi", "Bengali"]
const specialties = ["General Medicine", "Cardiology", "Gastroenterology", "Neurology", "Pulmonology", "Dermatology", "Orthopedics", "Pediatrics", "Gynecology", "Psychiatry", "ENT", "Ophthalmology", "Urology", "Endocrinology", "Musculoskeletal", "Infectious Disease"]

const HOSPITALS_BY_CITY = {
  "Bangalore": ["Manipal Hospital", "Fortis Hospital Bannerghatta", "Narayana Health City", "Apollo Hospital Jayanagar", "NIMHANS", "Sakra World Hospital", "Columbia Asia Hebbal", "BGS Gleneagles Hospital", "St. Johns Medical College", "Aster CMI Hospital", "Sparsh Hospital", "Cloudnine Hospital", "Vikram Hospital", "HOSMAT Hospital", "Bowring Hospital"],
  "Mumbai": ["Lilavati Hospital", "Kokilaben Hospital", "Hinduja Hospital", "Nanavati Hospital", "Wockhardt Hospital", "Fortis Mulund", "Bombay Hospital", "Breach Candy Hospital"],
  "Delhi": ["AIIMS Delhi", "Apollo Hospital Delhi", "Fortis Escorts", "Max Hospital Saket", "BLK Super Speciality", "Sir Ganga Ram Hospital", "Safdarjung Hospital", "Indraprastha Apollo"],
  "Hyderabad": ["Apollo Hospital Jubilee Hills", "KIMS Hospital", "Yashoda Hospital", "Care Hospital", "Omega Hospital", "Medicover Hospital", "Sunshine Hospital", "Nizam Institute"],
  "Chennai": ["Apollo Hospital Chennai", "Fortis Malar Hospital", "MIOT Hospital", "Vijaya Hospital", "Gleneagles Global Health City", "SRM Hospital", "Kauvery Hospital", "Billroth Hospital"],
  "Pune": ["Ruby Hall Clinic", "Jehangir Hospital", "KEM Hospital Pune", "Sahyadri Hospital", "Deenanath Mangeshkar Hospital", "Columbia Asia Pune", "Poona Hospital", "Inamdar Hospital"],
}

const CITIES = Object.keys(HOSPITALS_BY_CITY)

export default function DoctorAuth() {
  const [tab, setTab] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", qualification: "", specialty: "", license_no: "", experience: "", fee: "", about: "" })
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState(["English"])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [success, setSuccess] = useState("")
  const { login } = useApp()
  const navigate = useNavigate()

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setApiError(""); setErrors(e => ({ ...e, [k]: "" })) }

  const toggleLanguage = (lang) => {
    if (lang === "English") return
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])
  }

  const validate = () => {
    const e = {}
    if (tab === "signup") {
      if (!form.name.trim()) e.name = "Name is required"
      if (!form.specialty.trim()) e.specialty = "Specialty is required"
      if (!form.license_no.trim()) e.license_no = "License number is required"
      if (!selectedCity) e.city = "Please select your city"
      if (!selectedHospital) e.hospital = "Please select your hospital"
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter valid 10-digit mobile number"
      const exp = parseInt(form.experience)
      if (isNaN(exp) || exp < 0 || exp > 50) e.experience = "Experience must be between 0 and 50 years"
      const fee = parseInt(form.fee)
      if (isNaN(fee) || fee < 100) e.fee = "Fee must be at least ₹100"
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email"
    if (form.password.length < 6) e.password = "Password must be at least 6 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setApiError("")
    setSuccess("")
    try {
      if (tab === "signup") {
        const res = await registerDoctor({
          ...form,
          hospital: selectedHospital,
          languages: selectedLanguages.join(", ")
        })
        if (res.message === "Doctor registered. Pending admin verification.") {
          setSuccess("Registration successful! Await admin verification before logging in.")
          setTab("login")
          setForm(f => ({ ...f, name: "", phone: "", qualification: "", specialty: "", license_no: "", experience: "", fee: "", about: "" }))
          setSelectedCity("")
          setSelectedHospital("")
        } else {
          setApiError(res.message || "Registration failed")
        }
      } else {
        const res = await loginDoctor({ email: form.email, password: form.password })
        if (res.token) {
          localStorage.setItem("token", res.token)
          login("doctor", res.user)
          navigate("/doctor/dashboard")
        } else {
          setApiError(res.message || "Login failed")
        }
      }
    } catch {
      setApiError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", top: -150, left: -100 }} />
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 520, animation: "fadeInUp 0.5s ease forwards" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            Back to Home
          </button>
          <div className="glass-card" style={{ padding: "40px", border: "1px solid rgba(167,139,250,0.2)" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🩺</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Doctor Portal</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                {tab === "login" ? "Welcome back, Doctor!" : "Register to join MediRush platform."}
              </p>
            </div>

            <div className="tabs" style={{ marginBottom: 28 }}>
              <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErrors({}); setApiError("") }}>Sign In</button>
              <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setErrors({}); setApiError("") }}>Register</button>
            </div>

            {success && (
              <div style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 8, padding: "12px 16px", color: "var(--teal)", fontSize: "0.85rem", marginBottom: 16 }}>
                ✅ {success}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {tab === "signup" && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dr. Priya Nair" />
                    {errors.name && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876543210" maxLength={10} />
                    {errors.phone && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>Qualification</label>
                    <input value={form.qualification} onChange={e => set("qualification", e.target.value)} placeholder="MBBS, MD" />
                  </div>

                  <div className="form-group">
                    <label>Specialty</label>
                    <select value={form.specialty} onChange={e => set("specialty", e.target.value)}
                      style={{ background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: form.specialty ? "var(--text-primary)" : "var(--text-secondary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", width: "100%" }}>
                      <option value="">Select specialty</option>
                      {specialties.map(s => <option key={s} value={s} style={{ background: "var(--navy-mid)" }}>{s}</option>)}
                    </select>
                    {errors.specialty && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.specialty}</span>}
                  </div>

                  <div className="form-group">
                    <label>License Number</label>
                    <input value={form.license_no} onChange={e => set("license_no", e.target.value)} placeholder="KA-2020-12345" />
                    {errors.license_no && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.license_no}</span>}
                  </div>

                  {/* City selector */}
                  <div className="form-group">
                    <label>City / Town</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {CITIES.map(city => (
                        <button key={city} type="button" onClick={() => { setSelectedCity(city); setSelectedHospital("") }} style={{
                          padding: "6px 16px", borderRadius: 100, border: "1px solid",
                          borderColor: selectedCity === city ? "var(--teal)" : "var(--border)",
                          background: selectedCity === city ? "rgba(0,201,167,0.15)" : "transparent",
                          color: selectedCity === city ? "var(--teal)" : "var(--text-secondary)",
                          cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 500,
                          transition: "all 0.2s",
                        }}>
                          {selectedCity === city ? "✓ " : ""}{city}
                        </button>
                      ))}
                    </div>
                    {errors.city && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.city}</span>}
                  </div>

                  {/* Hospital selector */}
                  {selectedCity && (
                    <div className="form-group">
                      <label>Hospital / Clinic in {selectedCity}</label>
                      <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)}
                        style={{ background: "var(--navy-mid)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: selectedHospital ? "var(--text-primary)" : "var(--text-secondary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", width: "100%" }}>
                        <option value="">Select hospital in {selectedCity}</option>
                        {HOSPITALS_BY_CITY[selectedCity].map(h => (
                          <option key={h} value={h} style={{ background: "var(--navy-mid)" }}>{h}</option>
                        ))}
                      </select>
                      {errors.hospital && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.hospital}</span>}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="form-group">
                      <label>Experience (0-50 years)</label>
                      <input type="number" min={0} max={50} value={form.experience}
                        onChange={e => {
                          const val = Math.min(50, Math.max(0, parseInt(e.target.value) || 0))
                          set("experience", val)
                        }}
                        placeholder="5" />
                      {errors.experience && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.experience}</span>}
                    </div>
                    <div className="form-group">
                      <label>Consultation Fee (Rs.)</label>
                      <input type="number" min={100} value={form.fee} onChange={e => set("fee", e.target.value)} placeholder="499" />
                      {errors.fee && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.fee}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Languages You Speak</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {LANGUAGE_OPTIONS.map(lang => (
                        <button key={lang} type="button" onClick={() => toggleLanguage(lang)} style={{
                          padding: "5px 14px", borderRadius: 100, border: "1px solid",
                          borderColor: selectedLanguages.includes(lang) ? "var(--teal)" : "var(--border)",
                          background: selectedLanguages.includes(lang) ? "rgba(0,201,167,0.15)" : "transparent",
                          color: selectedLanguages.includes(lang) ? "var(--teal)" : "var(--text-secondary)",
                          cursor: lang === "English" ? "default" : "pointer",
                          fontFamily: "inherit", fontSize: "0.8rem", transition: "all 0.2s",
                        }}>
                          {lang}{lang === "English" ? " ✓" : ""}
                        </button>
                      ))}
                    </div>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 6 }}>English is required. Select additional languages.</p>
                  </div>

                  <div className="form-group">
                    <label>About (optional)</label>
                    <textarea value={form.about} onChange={e => set("about", e.target.value)}
                      placeholder="Brief description of your expertise..."
                      rows={3}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem", outline: "none", resize: "vertical" }} />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="doctor@hospital.com" />
                {errors.email && <span style={{ color: "var(--coral)", fontSize: "0.75rem" }}>{errors.email}</span>}
              </div>

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
                style={{ marginTop: 8, padding: "14px", fontSize: "0.95rem", width: "100%", background: "#a78bfa" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      {tab === "login" ? "Signing in..." : "Registering..."}
                    </span>
                  : tab === "login" ? "Sign In →" : "Register →"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
