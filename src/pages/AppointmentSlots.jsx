import React, { useState, useMemo } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useApp } from "../context/AppContext"
import { MOCK_HOSPITALS } from "../data/symptoms"

const ALL_SLOTS = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","2:00 PM","2:30 PM","3:00 PM",
  "3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM"
]

const DATES = [
  "2026-03-21","2026-03-22","2026-03-23","2026-03-24","2026-03-25","2026-03-26"
]

function getDoctorSlots(doctorId, date) {
  const seed = (doctorId * 31 + date.split("-").reduce((a, b) => a + parseInt(b), 0)) % 7
  const booked = ALL_SLOTS.slice(seed, seed + 3)
  return { booked }
}

export default function AppointmentSlots() {
  const { hospitalId } = useParams()
  const { analysisResult, currentUser, doctors } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const passedCity = location.state?.city || ""
  const passedHospital = location.state?.hospitalName || ""
  const hospital = MOCK_HOSPITALS.find(h => h.id === hospitalId) || { name: passedHospital || "Hospital" }
  const hospitalDisplayName = passedHospital || hospital.name
  const specialty = analysisResult?.results?.[0]?.specialty || "General Medicine"

  const availableDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchesSpecialty = d.specialty === specialty
      const keyword = hospitalDisplayName?.split(" ")[0]?.toLowerCase()
      const matchesHospital = d.hospital?.toLowerCase().includes(keyword)
      const isAvail = d.available === 1 || d.available === true
      return matchesSpecialty && matchesHospital && isAvail
    })
  }, [doctors, hospitalDisplayName, specialty])

  const displayDoctors = useMemo(() => {
    if (availableDoctors.length > 0) return availableDoctors
    // Fallback: show doctors from same city
    const cityDoctors = doctors.filter(d =>
      d.specialty === specialty &&
      (d.available === 1 || d.available === true) &&
      passedCity && d.hospital?.toLowerCase().includes(passedCity.toLowerCase().slice(0, 4))
    )
    if (cityDoctors.length > 0) return cityDoctors
    // Last fallback: any doctor with matching specialty
    return doctors.filter(d =>
      d.specialty === specialty &&
      (d.available === 1 || d.available === true)
    ).slice(0, 5)
  }, [availableDoctors, doctors, specialty, passedCity])

  const [selectedDate, setSelectedDate] = useState(DATES[0])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const { booked: bookedSlots } = useMemo(() => {
    if (!selectedDoctor) return { booked: [] }
    return getDoctorSlots(selectedDoctor.id, selectedDate)
  }, [selectedDoctor, selectedDate])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" })
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedSlot || !selectedDoctor) return
    navigate("/patient/payment", {
      state: {
        appointmentData: {
          patientName: currentUser?.name || "Patient",
          patientPhone: currentUser?.phone || "N/A",
          patientId: currentUser?.id,
          doctorId: selectedDoctor.user_id || selectedDoctor.id,
          doctorName: selectedDoctor.name,
          hospitalName: hospitalDisplayName,
          city: passedCity,
          specialty: selectedDoctor.specialty,
          disease: analysisResult?.results?.[0]?.disease || "General Consultation",
          symptoms: analysisResult?.selectedSymptoms || [],
          description: "",
          date: selectedDate,
          time: selectedSlot,
        }
      }
    })
  }

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        <button onClick={() => navigate("/patient/hospitals")} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          Back to Hospitals
        </button>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Book Appointment</h1>
          <p style={{ color: "var(--teal)", fontWeight: 600, fontSize: "0.9rem" }}>🏥 {hospitalDisplayName} {passedCity && `· ${passedCity}`}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
                Available {specialty} Specialists at {hospitalDisplayName}
              </h3>
              {displayDoctors.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>No doctors available for this specialty at this hospital.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {displayDoctors.map(doc => (
                    <div key={doc.id} onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null) }} style={{
                      padding: "16px", borderRadius: 10, border: "1px solid",
                      borderColor: selectedDoctor?.id === doc.id ? "var(--teal)" : "var(--border)",
                      background: selectedDoctor?.id === doc.id ? "rgba(0,201,167,0.08)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--navy)", fontWeight: 700, flexShrink: 0 }}>
                        {doc.name?.split(" ")[1]?.[0] || doc.name?.[0] || "D"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>{doc.name}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginBottom: 2 }}>{doc.qualification} · {doc.specialty} · {doc.experience} yrs</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>🏥 {doc.hospital}</div>
                        {doc.languages && <div style={{ color: "var(--text-dim)", fontSize: "0.72rem", marginTop: 2 }}>🗣️ {doc.languages}</div>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ color: "var(--amber)", fontSize: "0.82rem" }}>⭐ {parseFloat(doc.rating || 0).toFixed(1)}</div>
                        <div style={{ color: "var(--teal)", fontWeight: 700, fontSize: "0.95rem" }}>₹{doc.fee}</div>
                        {selectedDoctor?.id === doc.id && <div style={{ color: "var(--teal)", fontSize: "0.7rem", fontWeight: 700 }}>✓ Selected</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>Select Date</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {DATES.map(date => {
                  const { day, date: d, month } = formatDate(date)
                  return (
                    <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(null) }} style={{
                      padding: "10px 16px", borderRadius: 10, border: "1px solid",
                      borderColor: selectedDate === date ? "var(--teal)" : "var(--border)",
                      background: selectedDate === date ? "rgba(0,201,167,0.15)" : "transparent",
                      color: selectedDate === date ? "var(--teal)" : "var(--text-secondary)",
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "center", minWidth: 64,
                    }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 600 }}>{day}</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{d}</div>
                      <div style={{ fontSize: "0.7rem" }}>{month}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
                Time Slots {selectedDoctor ? `— ${selectedDoctor.name}` : ""}
              </h3>
              {!selectedDoctor ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Select a doctor first to see available slots.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {ALL_SLOTS.map(slot => {
                    const booked = bookedSlots.includes(slot)
                    const selected = selectedSlot === slot
                    return (
                      <button key={slot} onClick={() => !booked && setSelectedSlot(slot)} disabled={booked} style={{
                        padding: "8px 16px", borderRadius: 8, border: "1px solid",
                        borderColor: selected ? "var(--teal)" : "var(--border)",
                        background: selected ? "rgba(0,201,167,0.15)" : booked ? "rgba(255,255,255,0.02)" : "transparent",
                        color: selected ? "var(--teal)" : booked ? "var(--text-dim)" : "var(--text-secondary)",
                        cursor: booked ? "not-allowed" : "pointer",
                        fontFamily: "inherit", fontSize: "0.82rem", transition: "all 0.2s",
                        textDecoration: booked ? "line-through" : "none",
                      }}>
                        {slot}{booked ? " ✗" : ""}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
            <div className="glass-card" style={{ padding: "24px", border: "1px solid rgba(0,201,167,0.2)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 20 }}>Booking Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {[
                  ["🏥 Hospital", hospitalDisplayName],
                  ["📍 City", passedCity || "N/A"],
                  ["🩺 Doctor", selectedDoctor?.name || "—"],
                  ["🔬 Specialty", specialty],
                  ["📅 Date", selectedDate],
                  ["⏰ Time", selectedSlot || "—"],
                  ["🫀 Concern", analysisResult?.results?.[0]?.disease || "General Consultation"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{label}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.82rem", textAlign: "right", maxWidth: 160 }}>{val}</span>
                  </div>
                ))}
              </div>
              <hr className="divider" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 16, background: "rgba(255,217,61,0.06)", border: "1px solid rgba(255,217,61,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                Rs.250 token required · Non-refundable
              </div>
              <button className="btn-primary" onClick={handleProceedToPayment}
                disabled={!selectedSlot || !selectedDoctor}
                style={{ width: "100%", padding: "13px", fontSize: "0.9rem", opacity: (!selectedSlot || !selectedDoctor) ? 0.5 : 1 }}>
                Proceed to Pay Rs.250
              </button>
              {(!selectedSlot || !selectedDoctor) && (
                <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", textAlign: "center", marginTop: 10 }}>
                  {!selectedDoctor ? "Select a doctor first" : "Select a time slot"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
