import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { MOCK_HOSPITALS } from "../data/symptoms"
import { useApp } from "../context/AppContext"

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
}

export default function HospitalFinder() {
  const { analysisResult } = useApp()
  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState(null)
  const [locError, setLocError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hospitals, setHospitals] = useState([])
  const [cityName, setCityName] = useState("")

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by your browser.")
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setUserLocation({ lat: latitude, lng: longitude })

        // Reverse geocode to get city name
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.state_district || "your area"
          setCityName(city)
        } catch {
          setCityName("your area")
        }

        // Calculate distances and sort
        const withDistance = MOCK_HOSPITALS.map(h => ({
          ...h,
          distance: getDistance(latitude, longitude, h.lat, h.lng),
        })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

        // Filter by disease specialty if available
        const diagnosis = analysisResult?.disease
        const specialty = analysisResult?.specialty
        const filtered = specialty
          ? withDistance.filter(h => h.specialty.some(s => s === specialty || s === "General Medicine"))
          : withDistance

        setHospitals(filtered.length ? filtered : withDistance)
        setLoading(false)
      },
      (err) => {
        setLocError("Location access denied. Please enable location permission and reload.")
        // Fallback to Bangalore center
        const fallbackLat = 12.9716
        const fallbackLng = 77.5946
        setUserLocation({ lat: fallbackLat, lng: fallbackLng })
        setCityName("Bangalore (approximate)")
        const withDistance = MOCK_HOSPITALS.map(h => ({
          ...h,
          distance: getDistance(fallbackLat, fallbackLng, h.lat, h.lng),
        })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        setHospitals(withDistance)
        setLoading(false)
      }
    )
  }, [])

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <button onClick={() => navigate("/patient/analysis")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back to Analysis
        </button>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 8 }}>
            🏥 Nearby Hospitals
          </h1>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Detecting your location...
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              📍 Showing hospitals near <strong style={{ color: "var(--teal)" }}>{cityName}</strong>
              {analysisResult?.disease && <> · Filtered for <strong style={{ color: "var(--teal)" }}>{analysisResult.disease}</strong></>}
            </p>
          )}
          {locError && (
            <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: "0.8rem", color: "var(--coral)", marginTop: 10 }}>
              ⚠️ {locError}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} className="glass-card" style={{ padding: 24, opacity: 0.4, height: 100, animation: "pulse-teal 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {hospitals.map((h, i) => (
              <div key={h.id} className="glass-card" style={{
                padding: "22px 24px",
                border: i === 0 ? "1px solid rgba(0,201,167,0.3)" : "1px solid var(--border)",
                animation: `fadeInUp 0.4s ease ${i * 0.07}s both`,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,201,167,0.3)"; e.currentTarget.style.transform = "translateX(4px)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = i === 0 ? "rgba(0,201,167,0.3)" : "var(--border)"; e.currentTarget.style.transform = "translateX(0)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{h.name}</h3>
                      {i === 0 && <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100, background: "rgba(0,201,167,0.15)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)", fontWeight: 700 }}>📍 Nearest</span>}
                      <span style={{ fontSize: "0.7rem", color: "var(--amber)" }}>⭐ {h.rating}</span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 10 }}>🏠 {h.address}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {h.specialty.map(s => (
                        <span key={s} style={{
                          padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600,
                          background: s === analysisResult?.specialty ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.05)",
                          color: s === analysisResult?.specialty ? "var(--teal)" : "var(--text-secondary)",
                          border: `1px solid ${s === analysisResult?.specialty ? "rgba(0,201,167,0.3)" : "var(--border)"}`,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", color: "var(--teal)" }}>{h.distance} km</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>from your location</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: h.beds > 10 ? "var(--teal)" : h.beds > 5 ? "var(--amber)" : "var(--coral)", fontWeight: 700 }}>
                        {h.beds > 10 ? "🟢" : h.beds > 5 ? "🟡" : "🔴"} {h.beds} beds available
                      </div>
                    </div>
                    <button className="btn-primary" onClick={() => navigate(`/patient/slots/${h.id}`)}
                      style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                      Book Slot →
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