import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/history.css';

const DashboardPatient = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/appointments');
        const userAppointments = res.data.filter(apt => apt.patient._id === user._id);
        setAppointments(userAppointments);

        // Calculate stats
        const now = new Date();
        const upcoming = userAppointments.filter(apt => new Date(apt.date) > now && apt.status !== 'cancelled');
        const completed = userAppointments.filter(apt => apt.status === 'completed');

        setStats({
          totalAppointments: userAppointments.length,
          upcomingAppointments: upcoming.length,
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
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your health journey overview</p>
        </div>
        <div className="quick-actions">
          <Link to="/appointment" className="action-btn primary">
            <span className="btn-icon">📅</span>
            Book Appointment
          </Link>
          <Link to="/remedies" className="action-btn secondary">
            <span className="btn-icon">🌿</span>
            View Remedies
          </Link>
          <Link to="/chatbot" className="action-btn secondary">
            <span className="btn-icon">🤖</span>
            Ask AI
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
            <span>⏰</span>
          </div>
          <div className="stat-content">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming</p>
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

        <div className="stat-card">
          <div className="stat-icon">
            <span>💚</span>
          </div>
          <div className="stat-content">
            <h3>98%</h3>
            <p>Health Score</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Health Profile Card */}
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <h2>Your Health Profile</h2>
            <Link to="/profile" className="edit-link">Edit Profile</Link>
          </div>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="item-icon">📏</span>
              <div className="item-content">
                <strong>Height</strong>
                <span>{user?.height || 'Not set'} cm</span>
              </div>
            </div>

            <div className="profile-item">
              <span className="item-icon">⚖️</span>
              <div className="item-content">
                <strong>Weight</strong>
                <span>{user?.weight || 'Not set'} kg</span>
              </div>
            </div>

            <div className="profile-item">
              <span className="item-icon">🎂</span>
              <div className="item-content">
                <strong>Age</strong>
                <span>{user?.age || 'Not set'} years</span>
              </div>
            </div>

            {user?.disease && (
              <div className="profile-item">
                <span className="item-icon">🏥</span>
                <div className="item-content">
                  <strong>Condition</strong>
                  <span>{user.disease}</span>
                </div>
              </div>
            )}

            {user?.diseaseDuration && (
              <div className="profile-item">
                <span className="item-icon">⏱️</span>
                <div className="item-content">
                  <strong>Duration</strong>
                  <span>{user.diseaseDuration}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Our Healing Heritage Card */}
        <div className="dashboard-card heritage-card">
          <h2>Our Healing Heritage</h2>
          <div className="heritage-content">
            <div className="heritage-item">
              <div className="heritage-icon">
                <span>🏥</span>
              </div>
              <div className="heritage-text">
                <h4>Homeopathy</h4>
                <p>Founded by Samuel Hahnemann in 1796, based on "like cures like" principle. Uses highly diluted natural substances to stimulate the body's healing response.</p>
              </div>
            </div>

            <div className="heritage-item">
              <div className="heritage-icon">
                <span>🌿</span>
              </div>
              <div className="heritage-text">
                <h4>Naturopathy</h4>
                <p>Roots in 19th century Europe and America, focusing on natural healing methods including herbal medicine, nutrition, and lifestyle therapies to support self-healing.</p>
              </div>
            </div>

            <div className="heritage-item">
              <div className="heritage-icon">
                <span>💆‍♀️</span>
              </div>
              <div className="heritage-text">
                <h4>Acupressure</h4>
                <p>Ancient Chinese technique using finger pressure on meridian points to promote healing and relieve pain. A non-invasive alternative to acupuncture.</p>
              </div>
            </div>

            <div className="heritage-item">
              <div className="heritage-icon">
                <span>🪡</span>
              </div>
              <div className="heritage-text">
                <h4>Acupuncture</h4>
                <p>Traditional Chinese medicine using thin needles to balance energy flow (qi) through meridians. Recognized by WHO for various health conditions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="dashboard-card appointments-card">
          <div className="card-header">
            <h2>Your Appointments</h2>
            <Link to="/appointments" className="view-all-link">View All</Link>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.slice(0, 3).map(apt => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))}
              {appointments.length > 3 && (
                <div className="view-more">
                  <Link to="/appointments" className="view-more-btn">
                    View {appointments.length - 3} more appointments →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No appointments yet</h3>
              <p>Book your first consultation to start your healing journey</p>
              <Link to="/appointment" className="cta-btn">Book Appointment</Link>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/remedies" className="action-item">
              <span className="action-icon">🌿</span>
              <div className="action-content">
                <h4>Home Remedies</h4>
                <p>Discover natural remedies for common ailments</p>
              </div>
            </Link>

            <Link to="/yoga-meditation" className="action-item">
              <span className="action-icon">🧘‍♀️</span>
              <div className="action-content">
                <h4>Yoga & Meditation</h4>
                <p>Practice wellness exercises for mind and body</p>
              </div>
            </Link>

            <Link to="/chatbot" className="action-item">
              <span className="action-icon">🤖</span>
              <div className="action-content">
                <h4>AI Health Assistant</h4>
                <p>Get instant answers to your health questions</p>
              </div>
            </Link>

            <Link to="/doctors" className="action-item">
              <span className="action-icon">👨‍⚕️</span>
              <div className="action-content">
                <h4>Find Doctors</h4>
                <p>Browse and connect with expert practitioners</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPatient;
