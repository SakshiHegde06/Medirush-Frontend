const BASE_URL = "http://localhost:5000/api"

const getToken = () => localStorage.getItem("token")

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
})

export const registerPatient = (data) =>
  fetch(`${BASE_URL}/auth/patient/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json())

export const loginPatient = (data) =>
  fetch(`${BASE_URL}/auth/patient/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json())

export const registerDoctor = (data) =>
  fetch(`${BASE_URL}/auth/doctor/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json())

export const loginDoctor = (data) =>
  fetch(`${BASE_URL}/auth/doctor/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json())

export const loginAdmin = (data) =>
  fetch(`${BASE_URL}/auth/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json())

export const getAllDoctors = () =>
  fetch(`${BASE_URL}/doctors`, { headers: headers() }).then(r => r.json())

export const adminGetAllDoctors = () =>
  fetch(`${BASE_URL}/admin/doctors`, { headers: headers() }).then(r => r.json())

export const bookAppointment = (data) =>
  fetch(`${BASE_URL}/appointments`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json())

export const getMyAppointments = () =>
  fetch(`${BASE_URL}/appointments/my`, { headers: headers() }).then(r => r.json())

export const getDoctorAppointments = () =>
  fetch(`${BASE_URL}/appointments/doctor`, { headers: headers() }).then(r => r.json())

export const updateAppointmentStatus = (id, status) =>
  fetch(`${BASE_URL}/appointments/${id}/status`, { method: "PUT", headers: headers(), body: JSON.stringify({ status }) }).then(r => r.json())

export const rescheduleAppointment = (id, date, time) =>
  fetch(`${BASE_URL}/appointments/${id}/reschedule`, { method: "PUT", headers: headers(), body: JSON.stringify({ date, time }) }).then(r => r.json())

export const getAllAppointments = () =>
  fetch(`${BASE_URL}/appointments/all`, { headers: headers() }).then(r => r.json())

export const createPayment = (data) =>
  fetch(`${BASE_URL}/payments`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json())

export const getMyPayments = () =>
  fetch(`${BASE_URL}/payments/my`, { headers: headers() }).then(r => r.json())

export const submitRating = (data) =>
  fetch(`${BASE_URL}/ratings`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json())

export const getDoctorRatings = (doctorId) =>
  fetch(`${BASE_URL}/ratings/${doctorId}`).then(r => r.json())

export const getAdminStats = () =>
  fetch(`${BASE_URL}/admin/stats`, { headers: headers() }).then(r => r.json())

export const verifyDoctor = (id) =>
  fetch(`${BASE_URL}/admin/doctors/${id}/verify`, { method: "PUT", headers: headers() }).then(r => r.json())

export const removeDoctor = (id) =>
  fetch(`${BASE_URL}/admin/doctors/${id}`, { method: "DELETE", headers: headers() }).then(r => r.json())

export const getAllPatients = () =>
  fetch(`${BASE_URL}/patients/all`, { headers: headers() }).then(r => r.json())
