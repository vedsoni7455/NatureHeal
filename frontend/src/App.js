import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
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

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

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
              <Route path="/dashboard/patient" element={<ProtectedRoute allowedRoles={['patient']}><DashboardPatient /></ProtectedRoute>} />
              <Route path="/dashboard/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardDoctor /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></ProtectedRoute>} />
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
