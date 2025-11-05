import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHealthcareDropdownOpen, setIsHealthcareDropdownOpen] = useState(false);

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
    setIsDropdownOpen(false);
    setIsHealthcareDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleHealthcareDropdown = () => {
    setIsHealthcareDropdownOpen(!isHealthcareDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon">🌿</span>
            <span className="brand-text">NatureHeal</span>
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
              <div className="navbar-item">
                <Link to="/doctors" onClick={closeMenu}>Doctors</Link>
              </div>
              <div className="navbar-item">
                <Link to="/appointment" onClick={closeMenu}>Book Appointment</Link>
              </div>
              <div className="navbar-item has-dropdown">
                <div className="navbar-link" onClick={toggleHealthcareDropdown}>
                  Healthcare
                  <span className="dropdown-arrow">▼</span>
                </div>
                {isHealthcareDropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-item">
                      <Link to="/therapies" onClick={closeMenu}>
                        <span>💆‍♀️</span> Therapies
                      </Link>
                    </div>
                    <div className="navbar-dropdown-item">
                      <Link to="/remedies" onClick={closeMenu}>
                        <span>🌿</span> Remedies
                      </Link>
                    </div>
                    <div className="navbar-dropdown-item">
                      <Link to="/mudras" onClick={closeMenu}>
                        <span>🙏</span> Mudras
                      </Link>
                    </div>
                    <div className="navbar-dropdown-item">
                      <Link to="/yoga-meditation" onClick={closeMenu}>
                        <span>🧘‍♀️</span> Yoga & Meditation
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="navbar-item">
                <Link to="/symptom-checker" onClick={closeMenu}>Symptom Checker</Link>
              </div>

              <div className="navbar-item">
                <Link to="/diet-planner" onClick={closeMenu}>Diet Planner</Link>
              </div>
              <div className="navbar-item">
                <Link to="/chatbot" onClick={closeMenu}>AI Assistant</Link>
              </div>
              <div className="navbar-item">
                <Link to="/about" onClick={closeMenu}>About Us</Link>
              </div>
              <div className="navbar-item">
                <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
              </div>
            </div>
          )}

          <div className="navbar-end">
            {user ? (
              <div className="navbar-item has-dropdown">
                <div className="navbar-link" onClick={toggleDropdown}>
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.name}</span>
                </div>
                {isDropdownOpen && (
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
