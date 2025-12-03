import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPatient from './pages/DashboardPatient';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardAdmin from './pages/DashboardAdmin';
import AppointmentForm from './pages/AppointmentForm';
import Doctors from './pages/Doctors';
import Remedies from './pages/Remedies';
import AlternativeTherapies from './pages/AlternativeTherapies';
import Mudras from './pages/Mudras';
import YogaMeditation from './pages/YogaMeditation';
import ChatbotPage from './pages/ChatbotPage';
import Profile from './pages/Profile';
import SymptomChecker from './pages/SymptomChecker';
import DietPlanner from './pages/DietPlanner';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import ChangePassword from './pages/doctor/ChangePassword';
import VideoCall from './pages/VideoCall';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard/patient" element={<ProtectedRoute allowedRoles={['patient']}><DashboardPatient /></ProtectedRoute>} />
              <Route path="/dashboard/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardDoctor /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></ProtectedRoute>} />

              <Route path="/appointment" element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
              <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
              <Route path="/remedies" element={<ProtectedRoute><Remedies /></ProtectedRoute>} />
              <Route path="/therapies" element={<ProtectedRoute><AlternativeTherapies /></ProtectedRoute>} />
              <Route path="/mudras" element={<ProtectedRoute><Mudras /></ProtectedRoute>} />
              <Route path="/yoga-meditation" element={<ProtectedRoute><YogaMeditation /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
              <Route path="/diet-planner" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
              <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile /></ProtectedRoute>} />
              <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
              <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorSchedule /></ProtectedRoute>} />
              <Route path="/doctor/change-password" element={<ProtectedRoute allowedRoles={['doctor']}><ChangePassword /></ProtectedRoute>} />
              <Route path="/video-call/:appointmentId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
