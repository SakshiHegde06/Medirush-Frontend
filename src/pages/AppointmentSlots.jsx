
import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { MOCK_HOSPITALS, MOCK_SLOTS } from "../data/symptoms"

const DATES = ["2026-03-13", "2026-03-14", "2026-03-15", "2026-03-17", "2026-03-18"]
const bookedSlots = { "2026-03-13": ["9:00 AM", "10:30 AM", "2:00 PM"], "2026-03-14": ["9:30 AM", "11:00 AM", "3:30 PM"] }

export default function AppointmentSlots() {
  const { hospitalId } = useParams()
  const { analysisResult, currentUser, doctors } = useApp()
  const navigate = useNavigate()

  const hospital = MOCK_HOSPITALS.find(h => h.id === hospitalId) || MOCK_HOSPITALS[0]
  const specialty = analysisResult?.results?.[0]?.specialty || "General Medicine"
  const hospitalKeyword = hospital.name?.split(' ')[0]?.toLowerCase()
  const availableDoctors = doctors.filter(d =>
    d.status === 'verified' &&
    d.specialty === specialty &&
    d.hospital?.toLowerCase().includes(hospitalKeyword)
  )
  const displayDoctors = availableDoctors.length > 0 ? availableDoctors : doctors.filter(d => d.status === "verified" && d.specialty === specialty).slice(0, 5)

  const [selectedDate, setSelectedDate] = useState(DATES[0])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const takenSlots = bookedSlots[selectedDate] || []

  const handleProceedToPayment = () => {
    if (!selectedSlot || !selectedDoctor) return
    const appointmentData = {
      patientName: currentUser?.name || "Patient",
      patientId: currentUser?.id || "P_NEW",
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      hospitalName: hospital.name,
      specialty: selectedDoctor.specialty,
      disease: analysisResult?.results?.[0]?.disease || "General Consultation",
      date: selectedDate,
      time: selectedSlot,
      symptoms: analysisResult?.selectedSymptoms?.map(s => s.name) || [],
      description: analysisResult?.description || "",
    }
    navigate("/patient/payment", { state: { appointmentData } })
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigate("/patient/hospitals")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          â† Back to Hospitals
        </button>

        <div style={{ marginBottom: 32, animation: "fadeInUp 0.5s ease forwards" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 6 }}>{hospital.name}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>ðŸ“ {hospital.address} Â· Book an appointment</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Select Doctor */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
                Available {specialty} Specialists
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {displayDoctors.map(doc => (
                  <div key={doc.id} onClick={() => setSelectedDoctor(doc)} style={{
                    padding: "16px", borderRadius: 10, border: "1px solid",
                    borderColor: selectedDoctor?.id === doc.id ? "var(--teal)" : "var(--border)",
                    background: selectedDoctor?.id === doc.id ? "rgba(0,201,167,0.08)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--navy)", fontWeight: 700 }}>
                        {doc.name.split(" ").pop()[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{doc.name}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{doc.qualification} Â· {doc.specialty}</div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 2 }}>{doc.hospital}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span className="badge badge-success">Available</span>
                      {selectedDoctor?.id === doc.id && <span style={{ color: "var(--teal)" }}>âœ“</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Date */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
                Select Date
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {DATES.map(d => {
                  const date = new Date(d)
                  return (
                    <button key={d} onClick={() => { setSelectedDate(d); setSelectedSlot(null) }} style={{
                      padding: "12px 16px", borderRadius: 10, border: "1px solid",
                      borderColor: selectedDate === d ? "var(--teal)" : "var(--border)",
                      background: selectedDate === d ? "rgba(0,201,167,0.12)" : "transparent",
                      color: selectedDate === d ? "var(--teal)" : "var(--text-primary)",
                      cursor: "pointer", fontFamily: "inherit", textAlign: "center", minWidth: 64,
                      transition: "all 0.2s",
                    }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 600 }}>{date.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{date.getDate()}</div>
                      <div style={{ fontSize: "0.7rem" }}>{date.toLocaleDateString("en-IN", { month: "short" })}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Select Slot */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
                Available Time Slots
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                {MOCK_SLOTS.map(slot => {
                  const taken = takenSlots.includes(slot)
                  const selected = selectedSlot === slot
                  return (
                    <button key={slot} onClick={() => !taken && setSelectedSlot(slot)} disabled={taken} style={{
                      padding: "10px", borderRadius: 8, border: "1px solid",
                      borderColor: selected ? "var(--teal)" : taken ? "transparent" : "var(--border)",
                      background: selected ? "rgba(0,201,167,0.15)" : taken ? "rgba(255,255,255,0.02)" : "transparent",
                      color: selected ? "var(--teal)" : taken ? "var(--text-dim)" : "var(--text-primary)",
                      cursor: taken ? "not-allowed" : "pointer",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem",
                      textDecoration: taken ? "line-through" : "none",
                      transition: "all 0.2s",
                    }}>
                      {slot}
                      {taken && <div style={{ fontSize: "0.65rem", textDecoration: "none" }}>Booked</div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
            <div className="glass-card" style={{ padding: "28px", border: "1px solid rgba(0,201,167,0.2)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>Booking Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {[
                  ["ðŸ¥ Hospital", hospital.name],
                  ["ðŸ©º Doctor", selectedDoctor ? selectedDoctor.name : "â€”"],
                  ["ðŸ”¬ Specialty", specialty],
                  ["ðŸ“… Date", selectedDate || "â€”"],
                  ["ðŸ• Time", selectedSlot || "â€”"],
                  ["ðŸ«€ Concern", analysisResult?.results?.[0]?.disease || "General Consultation"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{label}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: value === "â€”" ? "var(--text-dim)" : "var(--text-primary)", textAlign: "right", maxWidth: 150 }}>{value}</span>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              {/* Token amount notice */}
              <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 8, padding: "10px 12px", fontSize: "0.76rem", color: "var(--coral)", marginBottom: 16, lineHeight: 1.6 }}>
                â‚¹250 token required Â· Non-refundable
              </div>

              <button
                className="btn-primary"
                onClick={handleProceedToPayment}
                disabled={!selectedSlot || !selectedDoctor}
                style={{ width: "100%", padding: "14px", fontSize: "0.95rem", opacity: (!selectedSlot || !selectedDoctor) ? 0.5 : 1 }}
              >
                Proceed to Pay â‚¹250 â†’
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


