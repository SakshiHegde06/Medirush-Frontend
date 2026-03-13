import React, { createContext, useContext, useState } from "react"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userType, setUserType] = useState(null)

  const [appointments, setAppointments] = useState([
    {
      id: "APT001", patientName: "Ananya Sharma", patientId: "P001",
      doctorId: "D001", doctorName: "Dr. Priya Nair", hospitalName: "Apollo Hospital",
      specialty: "Gastroenterology", disease: "Gastroenteritis",
      date: "2026-03-15", time: "10:00 AM", status: "pending",
      symptoms: ["Nausea", "Vomiting", "Stomach Pain"], description: "Severe nausea for 2 days.",
    },
    {
      id: "APT002", patientName: "Rohan Mehta", patientId: "P002",
      doctorId: "D002", doctorName: "Dr. Arvind Kumar", hospitalName: "Fortis Healthcare",
      specialty: "Cardiology", disease: "Hypertension",
      date: "2026-03-16", time: "2:30 PM", status: "accepted",
      symptoms: ["Headache", "Chest Pain"], description: "Persistent headache.",
    },
  ])

  const [doctors, setDoctors] = useState([
    { id: "D001", name: "Dr. Priya Nair", qualification: "MBBS, MD", specialty: "Gastroenterology", licenseNo: "MH-2019-45621", hospital: "Apollo Hospital", status: "verified", phone: "9876543210", email: "priya@apollo.com", fee: 499, rating: 4.8, totalConsultations: 1240, experience: 8, about: "Specialist in digestive disorders with 8 years of experience at Apollo Hospital. Known for accurate diagnosis and patient-friendly approach.", languages: ["English", "Hindi", "Telugu"], available: true },
    { id: "D002", name: "Dr. Arvind Kumar", qualification: "MBBS, DM", specialty: "Cardiology", licenseNo: "DL-2017-32104", hospital: "Fortis Healthcare", status: "verified", phone: "9988776655", email: "arvind@fortis.com", fee: 799, rating: 4.6, totalConsultations: 2100, experience: 12, about: "Senior cardiologist with 12+ years experience. Expert in hypertension, heart failure and preventive cardiology.", languages: ["English", "Hindi"], available: true },
    { id: "D003", name: "Dr. Meera Joshi", qualification: "MBBS, MD", specialty: "Pulmonology", licenseNo: "KA-2020-18834", hospital: "Manipal Hospitals", status: "verified", phone: "9871234560", email: "meera@manipal.com", fee: 599, rating: 4.7, totalConsultations: 890, experience: 6, about: "Pulmonologist specializing in asthma, COPD and respiratory infections. Compassionate and thorough in approach.", languages: ["English", "Kannada", "Hindi"], available: false },
    { id: "D004", name: "Dr. Rahul Verma", qualification: "MBBS, MS", specialty: "Neurology", licenseNo: "TN-2018-56789", hospital: "AIIMS Delhi", status: "verified", phone: "9765432109", email: "rahul@aiims.com", fee: 999, rating: 4.9, totalConsultations: 3200, experience: 15, about: "Top neurologist at AIIMS Delhi. Specializes in migraines, epilepsy and stroke management.", languages: ["English", "Hindi"], available: true },
    { id: "D005", name: "Dr. Sunita Reddy", qualification: "MBBS, MD", specialty: "Dermatology", licenseNo: "AP-2021-99012", hospital: "Narayana Health", status: "verified", phone: "9654321098", email: "sunita@narayana.com", fee: 449, rating: 4.5, totalConsultations: 670, experience: 5, about: "Dermatologist specializing in acne, eczema, psoriasis and cosmetic dermatology.", languages: ["English", "Telugu", "Tamil"], available: true },
    { id: "D006", name: "Dr. Kiran Patel", qualification: "MBBS, MD", specialty: "General Medicine", licenseNo: "GJ-2016-34521", hospital: "Kokilaben Hospital", status: "verified", phone: "9543210987", email: "kiran@kokilaben.com", fee: 349, rating: 4.4, totalConsultations: 4500, experience: 10, about: "General physician with 10 years experience. Expert in fever, infections, diabetes and lifestyle diseases.", languages: ["English", "Hindi", "Gujarati"], available: true },
  ])

  const [patients, setPatients] = useState([
    { id: "P001", name: "Ananya Sharma", email: "ananya@gmail.com", phone: "9123456789", history: [{ date: "2026-01-10", disease: "Flu", doctor: "Dr. Priya Nair" }, { date: "2026-02-20", disease: "Gastroenteritis", doctor: "Dr. Priya Nair" }] },
    { id: "P002", name: "Rohan Mehta", email: "rohan@gmail.com", phone: "9234567890", history: [{ date: "2025-12-05", disease: "Hypertension", doctor: "Dr. Arvind Kumar" }] },
  ])

  const [consultations, setConsultations] = useState([
    { id: "CON001", patientId: "P001", patientName: "Ananya Sharma", doctorId: "D001", doctorName: "Dr. Priya Nair", specialty: "Gastroenterology", date: "2026-01-15", mode: "Video", reason: "Stomach pain and nausea", status: "completed", fee: 499, followUpExpiry: "2026-01-22", rating: 5 },
    { id: "CON002", patientId: "P001", patientName: "Ananya Sharma", doctorId: "D002", doctorName: "Dr. Arvind Kumar", specialty: "Cardiology", date: "2026-02-10", mode: "Chat", reason: "High blood pressure concern", status: "completed", fee: 799, followUpExpiry: "2026-02-17", rating: 4 },
    { id: "CON003", patientId: "P001", patientName: "Ananya Sharma", doctorId: "D004", doctorName: "Dr. Rahul Verma", specialty: "Neurology", date: "2026-03-01", mode: "Audio", reason: "Recurring migraines", status: "completed", fee: 999, followUpExpiry: "2026-03-08", rating: 5 },
  ])

  const [analysisResult, setAnalysisResult] = useState(null)

  const login = (type, userData) => { setUserType(type); setCurrentUser(userData) }
  const logout = () => { setUserType(null); setCurrentUser(null); setAnalysisResult(null) }
  const verifyDoctor = (id) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: "verified" } : d))
  const removeDoctor = (id) => setDoctors(prev => prev.filter(d => d.id !== id))
  const addDoctor = (doctor) => setDoctors(prev => [...prev, { ...doctor, id: `D${Date.now()}`, status: "pending", fee: 499, rating: 0, totalConsultations: 0, experience: 0, available: false }])
  const updateAppointmentStatus = (id, status) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  const addAppointment = (apt) => setAppointments(prev => [...prev, { ...apt, id: `APT${Date.now()}`, status: "pending" }])
  const addConsultation = (con) => setConsultations(prev => [...prev, { ...con, id: `CON${Date.now()}`, status: "completed" }])

  return (
    <AppContext.Provider value={{
      currentUser, userType, login, logout,
      doctors, verifyDoctor, removeDoctor, addDoctor,
      patients, appointments, updateAppointmentStatus, addAppointment,
      consultations, addConsultation,
      analysisResult, setAnalysisResult,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
