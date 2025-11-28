import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const DashboardDoctor = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('booked');
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    bookedPatients: 0,
    diagnosedPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedPatient, setExpandedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients data
        const patientsRes = await api.get(`/doctor/patients?type=${activeTab}`);
        setPatients(patientsRes.data.patients);

        // Calculate stats
        const bookedRes = await api.get('/doctor/patients?type=booked');
        const diagnosedRes = await api.get('/doctor/patients?type=diagnosed');

        setStats({
          bookedPatients: bookedRes.data.total,
          diagnosedPatients: diagnosedRes.data.total
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, activeTab]);



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
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3>{stats.bookedPatients}</h3>
            <p>Booked Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>🏥</span>
          </div>
          <div className="stat-content">
            <h3>{stats.diagnosedPatients}</h3>
            <p>Diagnosed Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📋</span>
          </div>
          <div className="stat-content">
            <h3>{patients.length}</h3>
            <p>Active Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>⭐</span>
          </div>
          <div className="stat-content">
            <h3>4.8</h3>
            <p>Rating</p>
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

        {/* Patient Management Card */}
        <div className="dashboard-card patients-card">
          <div className="card-header">
            <h2>Patient Management</h2>
            <div className="card-actions">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'booked' ? 'active' : ''}`}
                  onClick={() => setActiveTab('booked')}
                >
                  Booked Patients
                </button>
                <button
                  className={`tab-btn ${activeTab === 'diagnosed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('diagnosed')}
                >
                  Diagnosed Patients
                </button>
              </div>
            </div>
          </div>

          {patients.length > 0 ? (
            <div className="patients-list">
              {patients.slice(0, 5).map(patient => (
                <div key={patient._id} className="patient-item">
                  <div className="patient-info">
                    <div className="patient-avatar">
                      <span>{patient.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="patient-details">
                      <h4>{patient.name}</h4>
                      <p>{patient.email}</p>
                      <span className="patient-status">
                        {activeTab === 'booked' ? 'Appointment Booked' : 'Diagnosis Complete'}
                      </span>
                    </div>
                  </div>
                  <div className="patient-actions">
                    <button
                      className="action-btn small"
                      onClick={() => setExpandedPatient(expandedPatient === patient._id ? null : patient._id)}
                    >
                      {expandedPatient === patient._id ? 'Hide' : 'View'} Details
                    </button>
                    <Link to={`/doctor/patients/${patient._id}`} className="action-btn small primary">
                      Manage
                    </Link>
                  </div>
                  {expandedPatient === patient._id && (
                    <div className="patient-expanded">
                      <div className="expanded-content">
                        <div className="detail-row">
                          <strong>Age:</strong> {patient.age || 'Not specified'}
                        </div>
                        <div className="detail-row">
                          <strong>Phone:</strong> {patient.phone || 'Not specified'}
                        </div>
                        <div className="detail-row">
                          <strong>Last Visit:</strong> {patient.lastVisit || 'No visits yet'}
                        </div>
                        <div className="detail-row">
                          <strong>Medical History:</strong> {patient.medicalHistory || 'No history available'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {patients.length > 5 && (
                <div className="view-more">
                  <Link to="/doctor/patients" className="view-more-btn">
                    View {patients.length - 5} more patients →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No {activeTab} patients</h3>
              <p>Your {activeTab} patients will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>Doctor Tools</h2>
          <div className="actions-grid">
            <Link to="/diet-planner" className="action-item">
              <span className="action-icon">🥗</span>
              <div className="action-content">
                <h4>Diet Planner</h4>
                <p>Create personalized diet plans for patients</p>
              </div>
            </Link>

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
