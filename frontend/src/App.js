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
import './App.css';

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
              <Route path="/dashboard/patient" element={<DashboardPatient />} />
              <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
              <Route path="/dashboard/admin" element={<DashboardAdmin />} />
              <Route path="/appointment" element={<AppointmentForm />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/remedies" element={<Remedies />} />
              <Route path="/therapies" element={<AlternativeTherapies />} />
              <Route path="/mudras" element={<Mudras />} />
              <Route path="/yoga-meditation" element={<YogaMeditation />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/diet-planner" element={<DietPlanner />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
