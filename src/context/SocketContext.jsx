import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import { useApp } from "./AppContext"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { currentUser, userType } = useApp()
  const socketRef = useRef(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const [notification, setNotification] = useState(null)
  const [callStatus, setCallStatus] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    socketRef.current = io("http://localhost:5000")

    socketRef.current.on("connect", () => {
      socketRef.current.emit("register", currentUser.id)
    })

    // Doctor receives incoming call
    socketRef.current.on("incoming_call", (data) => {
      setIncomingCall(data)
    })

    // Patient: call accepted by doctor
    socketRef.current.on("call_accepted", (data) => {
      setCallStatus({ status: "accepted", roomId: data.roomId })
      setNotification({ message: "Doctor accepted your call!", type: "success" })
      setTimeout(() => setNotification(null), 4000)
    })

    // Patient: call rejected by doctor
    socketRef.current.on("call_rejected", () => {
      setCallStatus({ status: "rejected" })
      setNotification({ message: "Doctor is busy. Please try again later.", type: "error" })
      setTimeout(() => setNotification(null), 4000)
    })

    // Doctor offline
    socketRef.current.on("doctor_offline", (data) => {
      setNotification({ message: data.message, type: "error" })
      setTimeout(() => setNotification(null), 4000)
    })

    // Appointment notifications
    socketRef.current.on("appointment_notification", (data) => {
      setNotification({ message: data.message, type: data.status === "accepted" ? "success" : "error" })
      setTimeout(() => setNotification(null), 5000)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [currentUser])

  const callDoctor = (data) => {
    socketRef.current?.emit("call_doctor", data)
  }

  const acceptCall = (data) => {
    socketRef.current?.emit("accept_call", data)
    setIncomingCall(null)
  }

  const rejectCall = (data) => {
    socketRef.current?.emit("reject_call", data)
    setIncomingCall(null)
  }

  const sendAppointmentUpdate = (data) => {
    socketRef.current?.emit("appointment_update", data)
  }

  return (
    <SocketContext.Provider value={{
      incomingCall, setIncomingCall,
      notification, setNotification,
      callStatus, setCallStatus,
      callDoctor, acceptCall, rejectCall,
      sendAppointmentUpdate,
      socket: socketRef.current,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
