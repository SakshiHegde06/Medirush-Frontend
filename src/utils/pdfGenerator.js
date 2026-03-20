import jsPDF from "jspdf"
import QRCode from "qrcode"

export async function generateAppointmentPDF(appointmentData) {
  const {
    bookingId,
    patientName,
    patientPhone,
    doctorName,
    specialty,
    hospitalName,
    city,
    date,
    time,
    paymentStatus = "Paid",
    amount = 250,
  } = appointmentData

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  // ─── Colors ───────────────────────────────────────────────
  const teal = [0, 168, 140]
  const navy = [10, 15, 30]
  const lightGray = [245, 245, 245]
  const textGray = [100, 100, 100]
  const white = [255, 255, 255]

  const pageW = 210
  const pageH = 297

  // ─── Background ───────────────────────────────────────────
  doc.setFillColor(...navy)
  doc.rect(0, 0, pageW, pageH, "F")

  // ─── Header bar ───────────────────────────────────────────
  doc.setFillColor(...teal)
  doc.rect(0, 0, pageW, 42, "F")

  // Logo / App name
  doc.setTextColor(...white)
  doc.setFontSize(26)
  doc.setFont("helvetica", "bold")
  doc.text("MediRush", 15, 18)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("AI-Powered Healthcare Platform", 15, 26)

  // Booking ID top right
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("BOOKING ID", pageW - 15, 14, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(bookingId, pageW - 15, 21, { align: "right" })

  // Appointment confirmed tag
  doc.setFillColor(255, 255, 255, 0.15)
  doc.setDrawColor(...white)
  doc.setLineWidth(0.3)
  doc.roundedRect(pageW - 70, 26, 56, 10, 3, 3, "D")
  doc.setFontSize(8)
  doc.setTextColor(...white)
  doc.text("✓  APPOINTMENT CONFIRMED", pageW - 42, 32.5, { align: "center" })

  // ─── White card ───────────────────────────────────────────
  doc.setFillColor(18, 23, 32)
  doc.setDrawColor(...teal)
  doc.setLineWidth(0.5)
  doc.roundedRect(12, 50, pageW - 24, 190, 5, 5, "FD")

  // ─── Patient section ──────────────────────────────────────
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...teal)
  doc.text("PATIENT INFORMATION", 22, 63)

  doc.setDrawColor(...teal)
  doc.setLineWidth(0.3)
  doc.line(22, 65, 95, 65)

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...white)
  doc.text(patientName, 22, 73)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textGray)
  doc.text(`Phone: ${patientPhone || "N/A"}`, 22, 80)

  // ─── Doctor section ───────────────────────────────────────
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...teal)
  doc.text("DOCTOR INFORMATION", 115, 63)

  doc.setDrawColor(...teal)
  doc.line(115, 65, 190, 65)

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...white)
  doc.text(doctorName, 115, 73)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textGray)
  doc.text(specialty, 115, 80)

  // ─── Divider ──────────────────────────────────────────────
  doc.setDrawColor(40, 50, 70)
  doc.setLineWidth(0.5)
  doc.line(22, 88, pageW - 22, 88)

  // ─── Appointment details grid ─────────────────────────────
  const details = [
    { label: "HOSPITAL", value: hospitalName },
    { label: "CITY", value: city || "Bangalore" },
    { label: "DATE", value: date },
    { label: "TIME", value: time },
    { label: "PAYMENT", value: paymentStatus },
    { label: "AMOUNT PAID", value: `Rs. ${amount}` },
  ]

  const colW = (pageW - 44) / 3
  details.forEach((d, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 22 + col * colW
    const y = 102 + row * 28

    // Card bg
    doc.setFillColor(25, 33, 48)
    doc.setDrawColor(40, 55, 75)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y - 8, colW - 4, 22, 3, 3, "FD")

    doc.setFontSize(7)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...teal)
    doc.text(d.label, x + 4, y)

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...white)
    doc.text(String(d.value), x + 4, y + 8)
  })

  // ─── QR Code ──────────────────────────────────────────────
  const qrData = JSON.stringify({ bookingId, patient: patientName, doctor: doctorName, date, time })
  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 200,
    margin: 1,
    color: { dark: "#00c9a7", light: "#0d1118" }
  })

  // QR box
  doc.setFillColor(25, 33, 48)
  doc.setDrawColor(...teal)
  doc.setLineWidth(0.5)
  doc.roundedRect(22, 162, 60, 65, 5, 5, "FD")

  doc.addImage(qrDataUrl, "PNG", 27, 167, 50, 50)

  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...teal)
  doc.text("Scan to verify appointment", 52, 225, { align: "center" })

  // ─── Important notes ──────────────────────────────────────
  doc.setFillColor(25, 33, 48)
  doc.setDrawColor(60, 40, 40)
  doc.setLineWidth(0.3)
  doc.roundedRect(92, 162, 96, 65, 5, 5, "FD")

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 100, 100)
  doc.text("IMPORTANT NOTES", 98, 173)

  const notes = [
    "• Rs.250 token is non-refundable",
    "• Arrive 15 mins before appointment",
    "• Carry this confirmation PDF",
    "• Rescheduling: 24hrs notice required",
    "• Contact: support@medirush.com",
  ]

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textGray)
  notes.forEach((note, i) => {
    doc.text(note, 98, 182 + i * 8)
  })

  // ─── Footer ───────────────────────────────────────────────
  doc.setFillColor(...teal)
  doc.rect(0, 250, pageW, 1, "F")

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textGray)
  doc.text("MediRush — AI-Powered Healthcare Platform", pageW / 2, 260, { align: "center" })
  doc.text("www.medirush.com  |  support@medirush.com  |  Emergency: 108", pageW / 2, 267, { align: "center" })

  doc.setFontSize(7)
  doc.setTextColor(60, 70, 90)
  doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, pageW / 2, 274, { align: "center" })

  // ─── Save ─────────────────────────────────────────────────
  doc.save(`MediRush_Booking_${bookingId}.pdf`)
}

export function generateBookingId() {
  const prefix = "MR"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
