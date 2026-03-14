import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { loginAdmin } from "../api/index"

export default function AdminAuth() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("All fields are required")
    setLoading(true)
    setError("")
    try {
      const res = await loginAdmin({ email: form.email, password: form.password })
      if (res.token) {
        localStorage.setItem("token", res.token)
        login("admin", res.user)
        navigate("/admin/dashboard")
      } else {
        setError(res.message || "Login failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)", top: -100, left: -100 }} />
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 420, animation: "fadeInUp 0.5s ease forwards" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Back to Home
          </button>
          <div className="glass-card" style={{ padding: "40px", border: "1px solid rgba(255,107,107,0.2)" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Admin Portal</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Restricted access. Authorized personnel only.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label>Admin Email</label>
                <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError("") }} placeholder="admin@medirush.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError("") }} placeholder="••••••••" />
              </div>
              {error && (
                <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--coral)", fontSize: "0.83rem" }}>
                  ⚠️ {error}
                </div>
              )}
              <button className="btn-primary" onClick={handleLogin} disabled={loading}
                style={{ marginTop: 8, padding: "14px", fontSize: "0.95rem", width: "100%", background: "var(--coral)" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Signing in...
                    </span>
                  : "Admin Sign In →"
                }
              </button>
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                admin@medirush.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
