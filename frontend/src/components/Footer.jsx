import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <h3 className="footer-logo">Healora</h3>
            <p className="footer-tagline">Promoting Natural Health through Naturopathy and Homeopathy.</p>
            <p className="footer-desc">Your trusted partner in holistic wellness and natural healing solutions.</p>
            <div className="social-icons">
              <span className="social-icon"><span>📱</span></span>
              <span className="social-icon"><span>🐦</span></span>
              <span className="social-icon"><span>📸</span></span>
              <span className="social-icon"><span>💼</span></span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/remedies">Remedies</Link></li>
              <li><Link to="/yoga-meditation">Yoga & Meditation</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/chatbot">AI Health Assistant</Link></li>
              <li><Link to="/remedies">Natural Remedies</Link></li>
              <li><Link to="/yoga-meditation">Wellness Programs</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:healora8144@gmail.com">healora8144@gmail.com</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>123 Natural Health Way<br />Wellness City, WC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Healora. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
