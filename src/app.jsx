import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppProvider, useApp } from "./context/AppContext"
import { LangProvider } from "./context/LangContext"
import { SocketProvider } from "./context/SocketContext"
import "./styles/global.css"
import Landing from "./pages/Landing"
import PatientAuth from "./pages/PatientAuth"
import DoctorAuth from "./pages/DoctorAuth"
import AdminAuth from "./pages/AdminAuth"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import AnalysisResult from "./pages/AnalysisResult"
import HospitalFinder from "./pages/HospitalFinder"
import AppointmentSlots from "./pages/AppointmentSlots"
import Payment from "./pages/Payment"
import OnlineConsult from "./pages/OnlineConsult"
import ConsultRoom from "./pages/ConsultRoom"
import MedicalRecords from "./pages/MedicalRecords"

function ProtectedRoute({ children, requiredType }) {
  const { currentUser, userType } = useApp()
  if (!currentUser) return <Navigate to="/" replace />
  if (requiredType && userType !== requiredType) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/patient/auth" element={<PatientAuth />} />
        <Route path="/doctor/auth" element={<DoctorAuth />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/patient/dashboard" element={<ProtectedRoute requiredType="patient"><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/analysis" element={<ProtectedRoute requiredType="patient"><AnalysisResult /></ProtectedRoute>} />
        <Route path="/patient/hospitals" element={<ProtectedRoute requiredType="patient"><HospitalFinder /></ProtectedRoute>} />
        <Route path="/patient/slots/:hospitalId" element={<ProtectedRoute requiredType="patient"><AppointmentSlots /></ProtectedRoute>} />
        <Route path="/patient/payment" element={<ProtectedRoute requiredType="patient"><Payment /></ProtectedRoute>} />
        <Route path="/patient/consult" element={<ProtectedRoute requiredType="patient"><OnlineConsult /></ProtectedRoute>} />
        <Route path="/patient/consult/:doctorId" element={<ProtectedRoute requiredType="patient"><ConsultRoom /></ProtectedRoute>} />
        <Route path="/patient/records" element={<ProtectedRoute requiredType="patient"><MedicalRecords /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute requiredType="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredType="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AppProvider>
    </LangProvider>
  )
}