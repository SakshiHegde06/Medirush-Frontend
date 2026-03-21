import React from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"

const riskConfig = {
  Low: { color: "#00c9a7", bg: "rgba(0,201,167,0.1)", border: "rgba(0,201,167,0.3)", icon: "green", label: "Low Risk", msg: "Your condition appears manageable. Monitor symptoms and consult a doctor if they worsen." },
  Moderate: { color: "#ffd93d", bg: "rgba(255,217,61,0.1)", border: "rgba(255,217,61,0.3)", icon: "yellow", label: "Moderate Risk", msg: "Medical consultation recommended within 24-48 hours. Do not ignore your symptoms." },
  High: { color: "#ff9500", bg: "rgba(255,149,0,0.1)", border: "rgba(255,149,0,0.3)", icon: "orange", label: "High Risk", msg: "Please seek medical attention soon. These symptoms may require immediate evaluation." },
  Critical: { color: "#ff6b6b", bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.3)", icon: "red", label: "Critical - Seek Emergency Care", msg: "These symptoms may indicate a serious condition. Go to the nearest hospital immediately or call 108." },
}

const riskDot = { green: "#00c9a7", yellow: "#ffd93d", orange: "#ff9500", red: "#ff6b6b" }

export default function AnalysisResult() {
  const { analysisResult } = useApp()
  const navigate = useNavigate()

  if (!analysisResult) {
    navigate("/patient/dashboard")
    return null
  }

  const { results, selectedSymptoms } = analysisResult
  const topResult = results[0]
  const risk = riskConfig[topResult.risk] || riskConfig["Moderate"]

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 500, height: 500, background: `radial-gradient(circle, ${risk.color}15 0%, transparent 70%)`, top: 0, left: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <button onClick={() => navigate("/patient/dashboard")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          Back to Dashboard
        </button>

        <div style={{ marginBottom: 32, animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 20, fontSize: "0.8rem", color: "var(--teal)", fontWeight: 600 }}>
            AI Analysis Complete
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", marginBottom: 8 }}>
            Your Symptom Analysis
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Based on {selectedSymptoms?.length || 0} symptoms · {results.length} possible condition{results.length > 1 ? "s" : ""} identified
          </p>
        </div>

        {/* Risk banner */}
        <div style={{ background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: riskDot[risk.icon], flexShrink: 0, boxShadow: `0 0 12px ${riskDot[risk.icon]}` }} />
          <div>
            <div style={{ fontWeight: 700, color: risk.color, fontSize: "1rem", marginBottom: 4 }}>{risk.label}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>{risk.msg}</div>
          </div>
        </div>

        {/* All results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {results.map((result, i) => {
            const r = riskConfig[result.risk] || riskConfig["Moderate"]
            return (
              <div key={i} className="glass-card" style={{
                padding: "24px",
                border: `1px solid ${i === 0 ? r.color + "40" : "var(--border)"}`,
                animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      {i === 0 && (
                        <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100, background: "rgba(0,201,167,0.15)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)", fontWeight: 700 }}>
                          Top Match
                        </span>
                      )}
                      <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100, background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40`, fontWeight: 700 }}>
                        {r.label}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", marginBottom: 6 }}>{result.disease}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 8 }}>{result.description}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 100, padding: "4px 12px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: 600 }}>Recommended: {result.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Symptoms selected */}
        {selectedSymptoms?.length > 0 && (
          <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Reported Symptoms
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedSymptoms.map(s => (
                <span key={s} style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", color: "var(--teal)", fontSize: "0.8rem" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => navigate("/patient/hospitals")} style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
            Find Hospitals Near You
          </button>
          <button className="btn-secondary" onClick={() => navigate("/patient/consult")} style={{ padding: "13px 28px", fontSize: "0.95rem" }}>
            Online Consultation
          </button>
          <button onClick={() => navigate("/patient/dashboard")} style={{ padding: "13px 28px", fontSize: "0.95rem", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}