import React from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { useLang } from "../context/LangContext"
import { useSocket } from "../context/SocketContext"
import IncomingCallModal from "./IncomingCallModal"

const portalColors = { patient: "#00c9a7", doctor: "#ffd93d", admin: "#ff6b6b" }
const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हि", name: "Hindi" },
  { code: "te", label: "తె", name: "Telugu" },
  { code: "ta", label: "த", name: "Tamil" },
  { code: "ka", label: "ಕ", name: "Kannada" },
]

export default function Navbar() {
  const { currentUser, userType, logout } = useApp()
  const { lang, setLang, t } = useLang()
  const { notification } = useSocket()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/") }

  return (
    <>
      <IncomingCallModal />

      {notification && (
        <div style={{
          position: "fixed", top: 88, right: 24, zIndex: 998,
          background: notification.type === "success" ? "rgba(0,201,167,0.15)" : "rgba(255,107,107,0.15)",
          border: `1px solid ${notification.type === "success" ? "rgba(0,201,167,0.4)" : "rgba(255,107,107,0.4)"}`,
          borderRadius: 10, padding: "14px 20px", fontSize: "0.88rem",
          color: notification.type === "success" ? "var(--teal)" : "var(--coral)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeInUp 0.3s ease forwards",
          maxWidth: 320,
        }}>
          {notification.type === "success" ? "✅" : "❌"} {notification.message}
        </div>
      )}

      <nav className="navbar">
        <a className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="navbar-logo-icon">🏥</div>
          <span className="navbar-logo-text">Medi<span>Rush</span></span>
        </a>

        <div className="navbar-right">
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3 }}>
            {languages.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} title={l.name} style={{
                padding: "4px 9px", borderRadius: 6, border: "none",
                background: lang === l.code ? "var(--teal)" : "transparent",
                color: lang === l.code ? "var(--navy)" : "var(--text-secondary)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem", fontWeight: 700,
                transition: "all 0.2s",
              }}>
                {l.label}
              </button>
            ))}
          </div>

          {currentUser && userType && (
            <>
              <div className="portal-tag" style={{ borderColor: portalColors[userType], color: portalColors[userType] }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: portalColors[userType], display: "inline-block" }} />
                {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{currentUser.name}</span>
              <button className="btn-secondary" onClick={handleLogout} style={{ padding: "7px 16px", fontSize: "0.82rem" }}>
                {t.logout}
              </button>
            </>
          )}
          {!currentUser && (
            <button className="btn-primary" onClick={() => navigate("/")} style={{ padding: "8px 20px" }}>
              Get Started
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
