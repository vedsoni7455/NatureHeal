import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsAIDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsAIDropdownOpen(false);
  };

  const toggleAIDropdown = () => {
    setIsAIDropdownOpen(!isAIDropdownOpen);
    setIsUserDropdownOpen(false);
  };


  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon">🌿</span>
            <span className="brand-text">Healora</span>
          </Link>
        </div>

        <div className="navbar-burger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          {user && (
            <div className="navbar-start">
              <div className="navbar-item">
                <Link to="/" onClick={closeMenu}>Home</Link>
              </div>
              {user.role === 'patient' && (
                <div className="navbar-item">
                  <Link to="/dashboard/patient" onClick={closeMenu}>Dashboard</Link>
                </div>
              )}
              {user.role === 'doctor' && (
                <div className="navbar-item">
                  <Link to="/dashboard/doctor" onClick={closeMenu}>Dashboard</Link>
                </div>
              )}
              {user.role === 'admin' && (
                <div className="navbar-item">
                  <Link to="/dashboard/admin" onClick={closeMenu}>Dashboard</Link>
                </div>
              )}
              {user.role === 'patient' && (
                <>
                  <div className="navbar-item">
                    <Link to="/doctors" onClick={closeMenu}>Doctors</Link>
                  </div>
                  <div className="navbar-item">
                    <Link to="/appointment" onClick={closeMenu}>Book Appointment</Link>
                  </div>
                </>
              )}

              {user.role === 'doctor' && (
                <>
                  <div className="navbar-item">
                    <Link to="/doctor/appointments" onClick={closeMenu}>My Appointments</Link>
                  </div>
                  <div className="navbar-item">
                    <Link to="/doctor/schedule" onClick={closeMenu}>My Schedule</Link>
                  </div>
                </>
              )}

              {user.role === 'patient' && (
                <div className="navbar-item has-dropdown">
                  <div className="navbar-link" onClick={toggleAIDropdown}>
                    <span style={{ marginRight: '0.3rem' }}>✨</span> AI Wellness Lab
                  </div>
                  {isAIDropdownOpen && (
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-item">
                        <Link to="/wellness-hub" onClick={closeMenu}>
                          <span>✨</span> Wellness Hub
                        </Link>
                      </div>
                      <div className="navbar-dropdown-item">
                        <Link to="/symptom-checker" onClick={closeMenu}>
                          <span>🔍</span> Symptom Checker
                        </Link>
                      </div>
                      <div className="navbar-dropdown-item">
                        <Link to="/diet-planner" onClick={closeMenu}>
                          <span>🥗</span> Diet Planner
                        </Link>
                      </div>
                      <div className="navbar-dropdown-item">
                        <Link to="/chatbot" onClick={closeMenu}>
                          <span>🤖</span> AI Assistant
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="navbar-item">
                <Link to="/about" onClick={closeMenu}>About Us</Link>
              </div>
              <div className="navbar-item">
                <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
              </div>

              {/* Mobile Only Profile & Logout */}
              <div className="navbar-item is-mobile-only">
                <Link to="/profile" onClick={closeMenu}>
                  <span>👤</span> Profile
                </Link>
              </div>
              <div className="navbar-item is-mobile-only">
                <button
                  onClick={handleLogout}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    color: 'var(--secondary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 500
                  }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          )}

          <div className="navbar-end">
            {user ? (
              <div className="navbar-item has-dropdown is-desktop-only">
                <div className="navbar-link" onClick={toggleUserDropdown}>
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.name}</span>
                </div>
                {isUserDropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-item">
                      <Link to="/profile" onClick={closeMenu}>
                        <span>👤</span> Profile
                      </Link>
                    </div>
                    <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e9ecef' }} />
                    <button onClick={handleLogout} className="navbar-dropdown-item logout-btn">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="buttons">
                <div className="navbar-item">
                  <Link to="/login" onClick={closeMenu}>Login</Link>
                </div>
                <div className="navbar-item">
                  <Link to="/register" onClick={closeMenu}>Register</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
