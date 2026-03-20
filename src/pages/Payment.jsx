import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { bookAppointment, createPayment } from "../api/index"
import { generateAppointmentPDF, generateBookingId } from "../utils/pdfGenerator"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const appointmentData = location.state?.appointmentData

  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [selectedUpiApp, setSelectedUpiApp] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [bookingId, setBookingId] = useState("")
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const upiApps = [
    { id: "phonepe", name: "PhonePe", icon: "💜" },
    { id: "gpay", name: "Google Pay", icon: "🔵" },
    { id: "paytm", name: "Paytm", icon: "🔷" },
    { id: "other", name: "Other UPI", icon: "📱" },
  ]

  const handlePay = async () => {
    if (!agreed) { setError("Please agree to the cancellation policy."); return }
    if (paymentMethod === "upi" && !selectedUpiApp) { setError("Please select a UPI app."); return }
    if (paymentMethod === "upi" && selectedUpiApp === "other" && !upiId.trim()) { setError("Please enter your UPI ID."); return }
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) { setError("Enter a valid 16-digit card number."); return }
      if (!cardName.trim()) { setError("Enter cardholder name."); return }
      if (!cardExpiry.trim()) { setError("Enter card expiry."); return }
      if (cardCvv.length < 3) { setError("Enter valid CVV."); return }
    }
    setError("")
    setPaying(true)
    try {
      const newBookingId = generateBookingId()
      setBookingId(newBookingId)

      await bookAppointment({
        doctor_id: appointmentData.doctorId,
        patient_name: appointmentData.patientName,
        doctor_name: appointmentData.doctorName,
        hospital_name: appointmentData.hospitalName,
        specialty: appointmentData.specialty,
        disease: appointmentData.disease,
        symptoms: appointmentData.symptoms || [],
        description: appointmentData.description || "",
        date: appointmentData.date,
        time: appointmentData.time,
      })

      await createPayment({
        reference_type: "appointment",
        amount: 250,
        method: paymentMethod === "upi" ? selectedUpiApp : "card",
      })

      setPaid(true)
    } catch (err) {
      setError("Payment failed. Please try again.")
      console.error(err)
    }
    setPaying(false)
  }

  const handleDownloadPDF = async () => {
    setGeneratingPdf(true)
    try {
      await generateAppointmentPDF({
        bookingId,
        patientName: appointmentData.patientName,
        patientPhone: appointmentData.patientPhone || "N/A",
        doctorName: appointmentData.doctorName,
        specialty: appointmentData.specialty,
        hospitalName: appointmentData.hospitalName,
        city: appointmentData.city || "Bangalore",
        date: appointmentData.date,
        time: appointmentData.time,
        paymentStatus: "Paid",
        amount: 250,
      })
    } catch (err) {
      console.error("PDF generation failed:", err)
    }
    setGeneratingPdf(false)
  }

  if (!appointmentData) {
    navigate("/patient/dashboard")
    return null
  }

  if (paid) return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
        <div className="glass-card" style={{ maxWidth: 500, width: "100%", padding: 48, textAlign: "center", border: "1px solid rgba(0,201,167,0.3)", animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,201,167,0.15)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>✅</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 6 }}>Rs.250 token amount paid</p>

          {/* Booking ID */}
          <div style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 10, padding: "12px 16px", margin: "16px 0" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 4 }}>BOOKING ID</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: "var(--teal)", fontWeight: 700, letterSpacing: 2 }}>{bookingId}</div>
          </div>

          <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 10, padding: "16px", margin: "16px 0", textAlign: "left" }}>
            {[
              ["Doctor", appointmentData.doctorName],
              ["Hospital", appointmentData.hospitalName],
              ["Date", appointmentData.date],
              ["Time", appointmentData.time],
              ["Token Paid", "Rs.250"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontWeight: 600, color: label === "Token Paid" ? "var(--teal)" : "var(--text-primary)" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: "0.78rem", color: "var(--coral)", marginBottom: 24 }}>
            Rs.250 token is non-refundable even if you cancel.
          </div>

          {/* Download PDF button */}
          <button onClick={handleDownloadPDF} disabled={generatingPdf}
            style={{ width: "100%", padding: "14px", marginBottom: 12, borderRadius: 8, border: "1px solid var(--teal)", background: "rgba(0,201,167,0.1)", color: "var(--teal)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
            {generatingPdf
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating PDF...</>
              : "📄 Download Appointment PDF"
            }
          </button>

          <button className="btn-primary" onClick={() => navigate("/patient/dashboard")} style={{ width: "100%", padding: "14px" }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="bg-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)", top: 0, right: 0 }} />
      <Navbar />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeInUp 0.5s ease forwards" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 6 }}>Pay Token Amount</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Complete payment to confirm your appointment</p>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.15), rgba(0,201,167,0.05))", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: 4 }}>Token Amount</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "var(--teal)" }}>Rs.250</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: 4 }}>Adjusted in final bill if you attend</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            <div>{appointmentData.doctorName}</div>
            <div>{appointmentData.date}</div>
            <div>{appointmentData.time}</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: "0.8rem", color: "var(--coral)", lineHeight: 1.6 }}>
          Non-Refundable Policy: This Rs.250 token is strictly non-refundable under any circumstances.
        </div>

        <div className="glass-card" style={{ padding: "24px", marginBottom: 16 }}>
          <div className="tabs" style={{ marginBottom: 24 }}>
            <button className={`tab ${paymentMethod === "upi" ? "active" : ""}`} onClick={() => setPaymentMethod("upi")}>UPI</button>
            <button className={`tab ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>Card</button>
          </div>

          {paymentMethod === "upi" && (
            <div style={{ animation: "fadeIn 0.3s ease forwards" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {upiApps.map(app => (
                  <button key={app.id} onClick={() => setSelectedUpiApp(app.id)} style={{
                    padding: "14px", borderRadius: 10, border: "1px solid",
                    borderColor: selectedUpiApp === app.id ? "var(--teal)" : "var(--border)",
                    background: selectedUpiApp === app.id ? "rgba(0,201,167,0.1)" : "transparent",
                    color: "var(--text-primary)", cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", fontWeight: 500,
                    transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: 22 }}>{app.icon}</span>
                    {app.name}
                    {selectedUpiApp === app.id && <span style={{ marginLeft: "auto", color: "var(--teal)" }}>✓</span>}
                  </button>
                ))}
              </div>
              {selectedUpiApp === "other" && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
                </div>
              )}
            </div>
          )}

          {paymentMethod === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn 0.3s ease forwards" }}>
              <div className="form-group">
                <label>Card Number</label>
                <input value={cardNumber} onChange={e => { const val = e.target.value.replace(/\D/g, "").slice(0, 16); setCardNumber(val.replace(/(.{4})/g, "$1 ").trim()) }} placeholder="1234 5678 9012 3456" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }} />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="ANANYA SHARMA" style={{ textTransform: "uppercase" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="form-group">
                  <label>Expiry</label>
                  <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="..." maxLength={3} type="password" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }} onClick={() => setAgreed(!agreed)}>
          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${agreed ? "var(--teal)" : "var(--border)"}`, background: agreed ? "var(--teal)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginTop: 2 }}>
            {agreed && <span style={{ color: "var(--navy)", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            I understand that the Rs.250 token amount is <strong style={{ color: "var(--coral)" }}>strictly non-refundable</strong> under any circumstances.
          </span>
        </div>

        {error && (
          <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "var(--coral)", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "16px", fontSize: "1rem" }}>
          {paying ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Processing Payment...
            </span>
          ) : "Pay Rs.250 & Confirm Appointment"}
        </button>
        <p style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 14 }}>
          Secured payment · Later powered by Razorpay
        </p>
      </div>
    </div>
  )
}
