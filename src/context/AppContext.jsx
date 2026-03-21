import React, { createContext, useContext, useState, useEffect } from "react"
import { getAllDoctors } from "../api/index"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || null)
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [consultations, setConsultations] = useState([])
  const [patients, setPatients] = useState([])
  const [analysisResult, setAnalysisResult] = useState(() => {
    const saved = localStorage.getItem("analysisResult")
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    getAllDoctors().then(data => {
      if (Array.isArray(data)) setDoctors(data)
    }).catch(() => {})
  }, [])

  const saveAnalysis = (result) => {
    setAnalysisResult(result)
    if (result) localStorage.setItem("analysisResult", JSON.stringify(result))
    else localStorage.removeItem("analysisResult")
  }

  const login = (type, userData) => {
    setUserType(type)
    setCurrentUser(userData)
    localStorage.setItem("userType", type)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUserType(null)
    setCurrentUser(null)
    setAnalysisResult(null)
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("user")
  }

  const verifyDoctor = (id) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: "verified" } : d))
  const removeDoctor = (id) => setDoctors(prev => prev.filter(d => d.id !== id))
  const addDoctor = (doctor) => setDoctors(prev => [...prev, doctor])
  const updateAppointmentStatus = (id, status) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  const addAppointment = (apt) => setAppointments(prev => [...prev, apt])
  const addConsultation = (con) => setConsultations(prev => [...prev, con])

  return (
    <AppContext.Provider value={{
      currentUser, userType, login, logout,
      doctors, verifyDoctor, removeDoctor, addDoctor,
      patients, appointments, updateAppointmentStatus, addAppointment,
      consultations, addConsultation,
      analysisResult, setAnalysisResult: saveAnalysis,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

