import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'patient' | 'doctor' | 'admin'
  const [appointments, setAppointments] = useState([
    {
      id: 'APT001',
      patientName: 'Ananya Sharma',
      patientId: 'P001',
      doctorId: 'D001',
      doctorName: 'Dr. Priya Nair',
      hospitalName: 'Apollo Hospital',
      specialty: 'Gastroenterology',
      disease: 'Gastroenteritis',
      date: '2026-03-15',
      time: '10:00 AM',
      status: 'pending',
      symptoms: ['Nausea', 'Vomiting', 'Stomach Pain'],
      description: 'Experiencing severe nausea and vomiting for past 2 days.',
    },
    {
      id: 'APT002',
      patientName: 'Rohan Mehta',
      patientId: 'P002',
      doctorId: 'D002',
      doctorName: 'Dr. Arvind Kumar',
      hospitalName: 'Fortis Healthcare',
      specialty: 'Cardiology',
      disease: 'Hypertension',
      date: '2026-03-16',
      time: '2:30 PM',
      status: 'accepted',
      symptoms: ['Headache', 'Chest Pain', 'Shortness of Breath'],
      description: 'Persistent headache and occasional chest discomfort.',
    },
  ]);

  const [doctors, setDoctors] = useState([
    { id: 'D001', name: 'Dr. Priya Nair', qualification: 'MBBS, MD', specialty: 'Gastroenterology', licenseNo: 'MH-2019-45621', hospital: 'Apollo Hospital', status: 'verified', phone: '9876543210', email: 'priya@apollo.com' },
    { id: 'D002', name: 'Dr. Arvind Kumar', qualification: 'MBBS, DM (Cardiology)', specialty: 'Cardiology', licenseNo: 'DL-2017-32104', hospital: 'Fortis Healthcare', status: 'verified', phone: '9988776655', email: 'arvind@fortis.com' },
    { id: 'D003', name: 'Dr. Meera Joshi', qualification: 'MBBS, MD (Pulmonology)', specialty: 'Pulmonology', licenseNo: 'KA-2020-18834', hospital: 'Manipal Hospitals', status: 'pending', phone: '9871234560', email: 'meera@manipal.com' },
    { id: 'D004', name: 'Dr. Rahul Verma', qualification: 'MBBS, MS (Neurology)', specialty: 'Neurology', licenseNo: 'TN-2018-56789', hospital: 'AIIMS Delhi', status: 'verified', phone: '9765432109', email: 'rahul@aiims.com' },
    { id: 'D005', name: 'Dr. Sunita Reddy', qualification: 'MBBS, MD (Dermatology)', specialty: 'Dermatology', licenseNo: 'AP-2021-99012', hospital: 'Narayana Health', status: 'pending', phone: '9654321098', email: 'sunita@narayana.com' },
  ]);

  const [patients, setPatients] = useState([
    { id: 'P001', name: 'Ananya Sharma', email: 'ananya@gmail.com', phone: '9123456789', history: [{ date: '2026-01-10', disease: 'Flu', doctor: 'Dr. Priya Nair' }, { date: '2026-02-20', disease: 'Gastroenteritis', doctor: 'Dr. Priya Nair' }] },
    { id: 'P002', name: 'Rohan Mehta', email: 'rohan@gmail.com', phone: '9234567890', history: [{ date: '2025-12-05', disease: 'Hypertension', doctor: 'Dr. Arvind Kumar' }] },
  ]);

  const [analysisResult, setAnalysisResult] = useState(null);

  const login = (type, userData) => {
    setUserType(type);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUserType(null);
    setCurrentUser(null);
    setAnalysisResult(null);
  };

  const verifyDoctor = (id) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'verified' } : d));
  };

  const removeDoctor = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const addDoctor = (doctor) => {
    setDoctors(prev => [...prev, { ...doctor, id: `D${Date.now()}`, status: 'pending' }]);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const addAppointment = (apt) => {
    setAppointments(prev => [...prev, { ...apt, id: `APT${Date.now()}`, status: 'pending' }]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, userType, login, logout,
      doctors, verifyDoctor, removeDoctor, addDoctor,
      patients,
      appointments, updateAppointmentStatus, addAppointment,
      analysisResult, setAnalysisResult,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);