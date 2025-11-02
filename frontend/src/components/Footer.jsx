import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>NatureHeal</h3>
          <p>Promoting Natural Health through Naturopathy and Homeopathy.</p>
          <p>Your trusted partner in holistic wellness and natural healing solutions.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/remedies">Remedies</Link></li>
            <li><Link to="/yoga-meditation">Yoga & Meditation</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/appointment">Book Appointment</Link></li>
            <li><Link to="/chatbot">AI Health Assistant</Link></li>
            <li><Link to="/remedies">Natural Remedies</Link></li>
            <li><Link to="/yoga-meditation">Wellness Programs</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📧 support@natureheal.com</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>📍 123 Natural Health Way</li>
            <li>🌐 Wellness City, WC 12345</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2023 NatureHeal. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
