import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    pendingAppointments: 0
  });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, aptRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/appointments')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAppointments(aptRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage the NatureHeal platform</p>
        </div>
        <div className="quick-actions">
          <Link to="/admin/users" className="action-btn primary">
            <span className="btn-icon">👥</span>
            Manage Users
          </Link>
          <Link to="/admin/reports" className="action-btn secondary">
            <span className="btn-icon">📊</span>
            View Reports
          </Link>
          <Link to="/admin/settings" className="action-btn secondary">
            <span className="btn-icon">⚙️</span>
            System Settings
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
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>👨‍⚕️</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDoctors}</h3>
            <p>Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>📅</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>💰</span>
          </div>
          <div className="stat-content">
            <h3>${stats.monthlyRevenue}</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>🔥</span>
          </div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span>⏳</span>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Users Card */}
        <div className="dashboard-card users-card">
          <div className="card-header">
            <h2>Recent Users</h2>
            <Link to="/admin/users" className="view-all-link">View All</Link>
          </div>

          {users.length > 0 ? (
            <div className="users-list">
              {users.slice(0, 5).map(user => (
                <div key={user._id} className="user-item">
                  <div className="user-avatar">
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button className="action-btn small">
                      <span>👁️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>User registrations will appear here</p>
            </div>
          )}
        </div>

        {/* Recent Appointments Card */}
        <div className="dashboard-card appointments-card">
          <div className="card-header">
            <h2>Recent Appointments</h2>
            <Link to="/admin/appointments" className="view-all-link">View All</Link>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.slice(0, 5).map(apt => (
                <div key={apt._id} className="appointment-item">
                  <div className="appointment-info">
                    <h4>{apt.patient?.name || 'Unknown Patient'}</h4>
                    <p>with Dr. {apt.doctor?.name || 'Unknown Doctor'}</p>
                    <span className="appointment-date">
                      {new Date(apt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="appointment-actions">
                    <button className="action-btn small">
                      <span>📋</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No appointments</h3>
              <p>Recent appointments will appear here</p>
            </div>
          )}
        </div>

        {/* System Health Card */}
        <div className="dashboard-card system-card">
          <div className="card-header">
            <h2>System Health</h2>
            <span className="status-indicator online">● Online</span>
          </div>
          <div className="system-metrics">
            <div className="metric-item">
              <span className="metric-label">Server Status</span>
              <span className="metric-value online">● Online</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Database</span>
              <span className="metric-value online">● Connected</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">API Response</span>
              <span className="metric-value">142ms</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Uptime</span>
              <span className="metric-value">99.9%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>Admin Tools</h2>
          <div className="actions-grid">
            <Link to="/admin/analytics" className="action-item">
              <span className="action-icon">📈</span>
              <div className="action-content">
                <h4>Analytics</h4>
                <p>View detailed platform analytics</p>
              </div>
            </Link>

            <Link to="/admin/content" className="action-item">
              <span className="action-icon">📝</span>
              <div className="action-content">
                <h4>Content Management</h4>
                <p>Manage remedies and resources</p>
              </div>
            </Link>

            <Link to="/admin/support" className="action-item">
              <span className="action-icon">🆘</span>
              <div className="action-content">
                <h4>Support Tickets</h4>
                <p>Handle user support requests</p>
              </div>
            </Link>

            <Link to="/admin/backups" className="action-item">
              <span className="action-icon">💾</span>
              <div className="action-content">
                <h4>Backups</h4>
                <p>Manage system backups</p>
              </div>
            </Link>

            <Link to="/admin/users" className="action-item">
              <span className="action-icon">👥</span>
              <div className="action-content">
                <h4>User Management</h4>
                <p>Manage users, doctors, and permissions</p>
              </div>
            </Link>

            <Link to="/admin/appointments" className="action-item">
              <span className="action-icon">📅</span>
              <div className="action-content">
                <h4>Appointment Oversight</h4>
                <p>Monitor and manage all appointments</p>
              </div>
            </Link>

            <Link to="/admin/reports" className="action-item">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <h4>System Reports</h4>
                <p>Generate comprehensive system reports</p>
              </div>
            </Link>

            <Link to="/admin/settings" className="action-item">
              <span className="action-icon">⚙️</span>
              <div className="action-content">
                <h4>System Settings</h4>
                <p>Configure platform settings and policies</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
