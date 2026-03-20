import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"

const HOSPITALS_BY_CITY = {
  "Bangalore": [
    { id: "H001", name: "Manipal Hospital", address: "98, HAL Airport Rd, Bangalore", specialty: ["Cardiology","Neurology","General Medicine"], rating: 4.7 },
    { id: "H002", name: "Fortis Hospital Bannerghatta", address: "154/9, Bannerghatta Rd, Bangalore", specialty: ["Pulmonology","Cardiology","Gastroenterology"], rating: 4.5 },
    { id: "H003", name: "Narayana Health City", address: "258/A, Bommasandra, Bangalore", specialty: ["Cardiology","Neurology","Dermatology"], rating: 4.8 },
    { id: "H004", name: "Apollo Hospital Jayanagar", address: "154, 11th Main Rd, Jayanagar, Bangalore", specialty: ["General Medicine","Gastroenterology","Dermatology"], rating: 4.6 },
    { id: "H005", name: "NIMHANS", address: "Hosur Rd, Lakkasandra, Bangalore", specialty: ["Neurology","Psychiatry","General Medicine"], rating: 4.9 },
    { id: "H006", name: "Sakra World Hospital", address: "52/2, Devarabisanahalli, Bangalore", specialty: ["Pulmonology","Gastroenterology","Cardiology"], rating: 4.6 },
    { id: "H007", name: "Columbia Asia Hebbal", address: "Kirloskar Business Park, Hebbal, Bangalore", specialty: ["General Medicine","Dermatology","Neurology"], rating: 4.4 },
    { id: "H008", name: "BGS Gleneagles Hospital", address: "67, Uttarahalli Rd, Kengeri, Bangalore", specialty: ["Cardiology","Pulmonology","Gastroenterology"], rating: 4.5 },
    { id: "H009", name: "St. Johns Medical College", address: "Sarjapur Rd, Koramangala, Bangalore", specialty: ["General Medicine","Neurology","Cardiology"], rating: 4.7 },
    { id: "H010", name: "Aster CMI Hospital", address: "New Airport Rd, Hebbal, Bangalore", specialty: ["Cardiology","Gastroenterology","Dermatology"], rating: 4.6 },
    { id: "H011", name: "Sparsh Hospital", address: "Infantry Rd, Bangalore", specialty: ["Musculoskeletal","General Medicine","Neurology"], rating: 4.5 },
    { id: "H012", name: "Cloudnine Hospital", address: "Old Airport Rd, Bangalore", specialty: ["General Medicine","Dermatology","Urology"], rating: 4.6 },
    { id: "H013", name: "Vikram Hospital", address: "Millers Rd, Bangalore", specialty: ["Pulmonology","Cardiology","General Medicine"], rating: 4.4 },
    { id: "H014", name: "HOSMAT Hospital", address: "Queens Rd, Bangalore", specialty: ["Musculoskeletal","General Medicine"], rating: 4.3 },
    { id: "H015", name: "Bowring Hospital", address: "Shivajinagar, Bangalore", specialty: ["General Medicine","Urology","Psychiatry"], rating: 4.2 },
  ],
  "Mumbai": [
    { id: "M001", name: "Lilavati Hospital", address: "Bandra West, Mumbai", specialty: ["Cardiology","Neurology","General Medicine"], rating: 4.8 },
    { id: "M002", name: "Kokilaben Hospital", address: "Andheri West, Mumbai", specialty: ["Cardiology","Gastroenterology","Dermatology"], rating: 4.7 },
    { id: "M003", name: "Hinduja Hospital", address: "Mahim, Mumbai", specialty: ["General Medicine","Neurology","Pulmonology"], rating: 4.6 },
    { id: "M004", name: "Nanavati Hospital", address: "Vile Parle, Mumbai", specialty: ["Urology","Musculoskeletal","General Medicine"], rating: 4.5 },
    { id: "M005", name: "Wockhardt Hospital", address: "South Mumbai", specialty: ["Cardiology","Pulmonology","Gastroenterology"], rating: 4.4 },
    { id: "M006", name: "Fortis Mulund", address: "Mulund, Mumbai", specialty: ["Dermatology","General Medicine","Neurology"], rating: 4.5 },
    { id: "M007", name: "Bombay Hospital", address: "Marine Lines, Mumbai", specialty: ["General Medicine","Psychiatry","Urology"], rating: 4.6 },
    { id: "M008", name: "Breach Candy Hospital", address: "Breach Candy, Mumbai", specialty: ["Gastroenterology","Cardiology","General Medicine"], rating: 4.7 },
  ],
  "Delhi": [
    { id: "D001", name: "AIIMS Delhi", address: "Ansari Nagar, New Delhi", specialty: ["Neurology","Cardiology","General Medicine"], rating: 4.9 },
    { id: "D002", name: "Apollo Hospital Delhi", address: "Sarita Vihar, New Delhi", specialty: ["Cardiology","Gastroenterology","Dermatology"], rating: 4.8 },
    { id: "D003", name: "Fortis Escorts", address: "Okhla, New Delhi", specialty: ["Cardiology","Pulmonology","General Medicine"], rating: 4.7 },
    { id: "D004", name: "Max Hospital Saket", address: "Saket, New Delhi", specialty: ["Neurology","Musculoskeletal","General Medicine"], rating: 4.7 },
    { id: "D005", name: "BLK Super Speciality", address: "Pusa Rd, New Delhi", specialty: ["Gastroenterology","Urology","Cardiology"], rating: 4.6 },
    { id: "D006", name: "Sir Ganga Ram Hospital", address: "Rajinder Nagar, Delhi", specialty: ["General Medicine","Dermatology","Psychiatry"], rating: 4.7 },
    { id: "D007", name: "Safdarjung Hospital", address: "Safdarjung, New Delhi", specialty: ["General Medicine","Pulmonology","Neurology"], rating: 4.3 },
    { id: "D008", name: "Indraprastha Apollo", address: "Jasola, New Delhi", specialty: ["Cardiology","Gastroenterology","Musculoskeletal"], rating: 4.8 },
  ],
  "Hyderabad": [
    { id: "HY001", name: "Apollo Hospital Jubilee Hills", address: "Jubilee Hills, Hyderabad", specialty: ["Cardiology","Neurology","General Medicine"], rating: 4.8 },
    { id: "HY002", name: "KIMS Hospital", address: "Secunderabad, Hyderabad", specialty: ["Gastroenterology","Pulmonology","Dermatology"], rating: 4.6 },
    { id: "HY003", name: "Yashoda Hospital", address: "Somajiguda, Hyderabad", specialty: ["Cardiology","General Medicine","Urology"], rating: 4.7 },
    { id: "HY004", name: "Care Hospital", address: "Banjara Hills, Hyderabad", specialty: ["Neurology","Musculoskeletal","General Medicine"], rating: 4.5 },
    { id: "HY005", name: "Omega Hospital", address: "Hitech City, Hyderabad", specialty: ["Gastroenterology","Dermatology","Psychiatry"], rating: 4.4 },
    { id: "HY006", name: "Medicover Hospital", address: "Madhapur, Hyderabad", specialty: ["General Medicine","Cardiology","Pulmonology"], rating: 4.5 },
    { id: "HY007", name: "Sunshine Hospital", address: "Secunderabad, Hyderabad", specialty: ["Musculoskeletal","General Medicine","Urology"], rating: 4.6 },
    { id: "HY008", name: "Nizam Institute", address: "Punjagutta, Hyderabad", specialty: ["Neurology","Cardiology","General Medicine"], rating: 4.8 },
  ],
  "Chennai": [
    { id: "C001", name: "Apollo Hospital Chennai", address: "Greams Rd, Chennai", specialty: ["Cardiology","Neurology","General Medicine"], rating: 4.9 },
    { id: "C002", name: "Fortis Malar Hospital", address: "Adyar, Chennai", specialty: ["Cardiology","Gastroenterology","Dermatology"], rating: 4.7 },
    { id: "C003", name: "MIOT Hospital", address: "Manapakkam, Chennai", specialty: ["Musculoskeletal","General Medicine","Neurology"], rating: 4.7 },
    { id: "C004", name: "Vijaya Hospital", address: "Vadapalani, Chennai", specialty: ["General Medicine","Urology","Pulmonology"], rating: 4.5 },
    { id: "C005", name: "Gleneagles Global Health City", address: "Perumbakkam, Chennai", specialty: ["Cardiology","Gastroenterology","General Medicine"], rating: 4.8 },
    { id: "C006", name: "SRM Hospital", address: "Kattankulathur, Chennai", specialty: ["Neurology","Dermatology","Psychiatry"], rating: 4.5 },
    { id: "C007", name: "Kauvery Hospital", address: "Alwarpet, Chennai", specialty: ["General Medicine","Cardiology","Pulmonology"], rating: 4.6 },
    { id: "C008", name: "Billroth Hospital", address: "Shenoy Nagar, Chennai", specialty: ["Gastroenterology","Urology","General Medicine"], rating: 4.4 },
  ],
  "Pune": [
    { id: "P001", name: "Ruby Hall Clinic", address: "Sassoon Rd, Pune", specialty: ["Cardiology","Neurology","General Medicine"], rating: 4.8 },
    { id: "P002", name: "Jehangir Hospital", address: "Sassoon Rd, Pune", specialty: ["General Medicine","Gastroenterology","Dermatology"], rating: 4.7 },
    { id: "P003", name: "KEM Hospital Pune", address: "Rasta Peth, Pune", specialty: ["General Medicine","Pulmonology","Psychiatry"], rating: 4.5 },
    { id: "P004", name: "Sahyadri Hospital", address: "Deccan Gymkhana, Pune", specialty: ["Cardiology","Musculoskeletal","General Medicine"], rating: 4.6 },
    { id: "P005", name: "Deenanath Mangeshkar Hospital", address: "Erandwane, Pune", specialty: ["Neurology","Gastroenterology","Urology"], rating: 4.7 },
    { id: "P006", name: "Columbia Asia Pune", address: "Kharadi, Pune", specialty: ["Dermatology","General Medicine","Cardiology"], rating: 4.5 },
    { id: "P007", name: "Poona Hospital", address: "Sadashiv Peth, Pune", specialty: ["General Medicine","Pulmonology","Musculoskeletal"], rating: 4.3 },
    { id: "P008", name: "Inamdar Hospital", address: "Fatima Nagar, Pune", specialty: ["Gastroenterology","Cardiology","General Medicine"], rating: 4.4 },
  ],
}

const CITIES = Object.keys(HOSPITALS_BY_CITY)

export default function HospitalFinder() {
  const { analysisResult } = useApp()
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState("")
  const [hospitals, setHospitals] = useState([])
  const [searched, setSearched] = useState(false)

  const specialty = analysisResult?.results?.[0]?.specialty || analysisResult?.[0]?.specialty || "General Medicine"
  const disease = analysisResult?.results?.[0]?.disease || analysisResult?.[0]?.disease || "General Consultation"

  const handleSearch = () => {
    if (!selectedCity) return
    const cityHospitals = HOSPITALS_BY_CITY[selectedCity] || []
    const filtered = cityHospitals.filter(h =>
      h.specialty.some(s => s === specialty || s === "General Medicine")
    )
    setHospitals(filtered.length ? filtered : cityHospitals)
    setSearched(true)
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <button onClick={() => navigate("/patient/analysis")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          Back to Analysis
        </button>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 8 }}>Find Hospitals</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Showing hospitals for <strong style={{ color: "var(--teal)" }}>{specialty}</strong>
            {disease && <> · Possible condition: <strong style={{ color: "var(--teal)" }}>{disease}</strong></>}
          </p>
        </div>

        <div className="glass-card" style={{ padding: "28px", marginBottom: 32, border: "1px solid rgba(0,201,167,0.2)" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 6 }}>Select Your City</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 16 }}>We will show hospitals in your city that specialize in your condition.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {CITIES.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)} style={{
                padding: "8px 22px", borderRadius: 100, border: "1px solid",
                borderColor: selectedCity === city ? "var(--teal)" : "var(--border)",
                background: selectedCity === city ? "rgba(0,201,167,0.15)" : "transparent",
                color: selectedCity === city ? "var(--teal)" : "var(--text-secondary)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 500,
                transition: "all 0.2s",
              }}>
                {selectedCity === city ? "✓ " : ""}{city}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={handleSearch} disabled={!selectedCity}
            style={{ padding: "11px 32px", fontSize: "0.9rem", opacity: !selectedCity ? 0.5 : 1 }}>
            Find Hospitals in {selectedCity || "..."} →
          </button>
        </div>

        {searched && (
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 20 }}>
              Found <strong style={{ color: "var(--teal)" }}>{hospitals.length}</strong> hospitals in <strong style={{ color: "var(--teal)" }}>{selectedCity}</strong> for <strong style={{ color: "var(--teal)" }}>{specialty}</strong>
            </p>
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
                        {i === 0 && <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 100, background: "rgba(0,201,167,0.15)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.3)", fontWeight: 700 }}>Top Rated</span>}
                        <span style={{ fontSize: "0.75rem", color: "var(--amber)" }}>⭐ {h.rating}</span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 10 }}>📍 {h.address}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {h.specialty.map(s => (
                          <span key={s} style={{
                            padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600,
                            background: s === specialty ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.05)",
                            color: s === specialty ? "var(--teal)" : "var(--text-secondary)",
                            border: `1px solid ${s === specialty ? "rgba(0,201,167,0.3)" : "var(--border)"}`,
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button className="btn-primary"
                        onClick={() => navigate(`/patient/slots/${h.id}`, { state: { city: selectedCity, hospitalName: h.name } })}
                        style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                        Book Slot →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏥</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", marginBottom: 8 }}>Select your city above</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>We have hospitals across Bangalore, Mumbai, Delhi, Hyderabad, Chennai and Pune.</p>
          </div>
        )}
      </div>
    </div>
  )
}
