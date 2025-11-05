import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';

const DashboardDoctor = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/appointments');
        const doctorAppointments = res.data.filter(apt => apt.doctor._id === user._id);
        setAppointments(doctorAppointments);

        // Calculate stats
        const today = new Date().toDateString();
        const todayApts = doctorAppointments.filter(apt => new Date(apt.date).toDateString() === today);
        const pending = doctorAppointments.filter(apt => apt.status === 'pending');
        const completed = doctorAppointments.filter(apt => apt.status === 'completed');

        setStats({
          totalAppointments: doctorAppointments.length,
          todayAppointments: todayApts.length,
          pendingAppointments: pending.length,
          completedAppointments: completed.length
        });
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status } : apt));

      // Update stats
      const updatedAppointments = appointments.map(apt => apt._id === id ? { ...apt, status } : apt);
      const pending = updatedAppointments.filter(apt => apt.status === 'pending');
      const completed = updatedAppointments.filter(apt => apt.status === 'completed');

      setStats(prev => ({
        ...prev,
        pendingAppointments: pending.length,
        completedAppointments: completed.length
      }));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, Dr. {user?.name}!</h1>
          <p>Manage your appointments and patient care</p>
        </div>
        <div className="quick-actions">
          <Link to="/schedule" className="action-btn primary">
            <span className="btn-icon">📅</span>
            Manage Schedule
          </Link>
          <Link to="/patients" className="action-btn secondary">
            <span className="btn-icon">👥</span>
            View Patients
          </Link>
          <Link to="/profile" className="action-btn secondary">
            <span className="btn-icon">⚙️</span>
            Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <span>📊</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📅</span>
          </div>
          <div className="stat-content">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>⏳</span>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>✅</span>
          </div>
          <div className="stat-content">
            <h3>{stats.completedAppointments}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Doctor Profile Card */}
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <h2>Your Profile</h2>
            <Link to="/profile" className="edit-link">Edit Profile</Link>
          </div>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="item-icon">👨‍⚕️</span>
              <div className="item-content">
                <strong>Specialization</strong>
                <span>{user?.specialization || 'Not set'}</span>
              </div>
            </div>

            <div className="profile-item">
              <span className="item-icon">📚</span>
              <div className="item-content">
                <strong>Experience</strong>
                <span>{user?.experience || '0'} years</span>
              </div>
            </div>

            <div className="profile-item">
              <span className="item-icon">🏥</span>
              <div className="item-content">
                <strong>License</strong>
                <span>{user?.licenseNumber || 'Not set'}</span>
              </div>
            </div>

            <div className="profile-item">
              <span className="item-icon">⭐</span>
              <div className="item-content">
                <strong>Rating</strong>
                <span>4.8/5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Management Card */}
        <div className="dashboard-card appointments-card">
          <div className="card-header">
            <h2>Appointment Management</h2>
            <div className="card-actions">
              <select className="filter-select">
                <option value="all">All Appointments</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.slice(0, 5).map(apt => (
                <div key={apt._id} className="appointment-item">
                  <AppointmentCard appointment={apt} />
                  <div className="appointment-actions">
                    <select
                      value={apt.status}
                      onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="action-btn small">
                      <span>💬</span> Message
                    </button>
                  </div>
                </div>
              ))}
              {appointments.length > 5 && (
                <div className="view-more">
                  <Link to="/appointments" className="view-more-btn">
                    View {appointments.length - 5} more appointments →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No appointments scheduled</h3>
              <p>Your upcoming appointments will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>Doctor Tools</h2>
          <div className="actions-grid">
            <Link to="/prescriptions" className="action-item">
              <span className="action-icon">💊</span>
              <div className="action-content">
                <h4>Prescriptions</h4>
                <p>Manage patient prescriptions and remedies</p>
              </div>
            </Link>

            <Link to="/reports" className="action-item">
              <span className="action-icon">📋</span>
              <div className="action-content">
                <h4>Medical Reports</h4>
                <p>View and generate patient reports</p>
              </div>
            </Link>

            <Link to="/schedule" className="action-item">
              <span className="action-icon">🕐</span>
              <div className="action-content">
                <h4>Schedule</h4>
                <p>Manage your availability and appointments</p>
              </div>
            </Link>

            <Link to="/resources" className="action-item">
              <span className="action-icon">📚</span>
              <div className="action-content">
                <h4>Resources</h4>
                <p>Access medical resources and guidelines</p>
              </div>
            </Link>

            <Link to="/symptom-checker" className="action-item">
              <span className="action-icon">🔍</span>
              <div className="action-content">
                <h4>Symptom Checker</h4>
                <p>Analyze patient symptoms and conditions</p>
              </div>
            </Link>

            <Link to="/chatbot" className="action-item">
              <span className="action-icon">🤖</span>
              <div className="action-content">
                <h4>AI Assistant</h4>
                <p>Get AI-powered medical insights</p>
              </div>
            </Link>

            <Link to="/symptom-checker" className="action-item">
              <span className="action-icon">🔍</span>
              <div className="action-content">
                <h4>Symptom Analysis</h4>
                <p>Review patient symptoms and provide guidance</p>
              </div>
            </Link>

            <Link to="/profile" className="action-item">
              <span className="action-icon">⚙️</span>
              <div className="action-content">
                <h4>Profile Settings</h4>
                <p>Update your professional information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
