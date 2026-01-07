import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/home_redesign.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const welcomeMessage = location.state?.welcomeMessage;

  const slides = [
    {
      title: "Welcome to Healora",
      subtitle: "Your Journey to Natural Wellness Begins Here",
      description: "Discover the power of natural healing through naturopathy and homeopathy.",
      bgImage: "url('https://www.defeatingepilepsy.org/wp-content/uploads/2022/07/holistic-health-1024x678.jpg')"
    },
    {
      title: "Personalized Care",
      subtitle: "Tailored Solutions for Your Unique Needs",
      description: "Share your health details and receive personalized natural remedies.",
      bgImage: "url('https://teldoc.com.au/wp-content/uploads/2024/08/medicinal-herbs-homeopathy-and-alternative-medicin-2024-12-19-20-05-42-utc-scaled.jpg')"
    },
    {
      title: "Expert Guidance",
      subtitle: "Connect with Certified Naturopaths",
      description: "Book appointments with experienced practitioners instantly.",
      bgImage: "url('https://citynaturopathic.ca/wp-content/uploads/2022/12/what-is-homeopathic-medicine.webp')"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: slides[currentSlide].bgImage, transition: 'background-image 1s ease-in-out' }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            {user && currentSlide === 0 ? (welcomeMessage || `Welcome back, ${user.name}!`) : slides[currentSlide].title}
          </h1>
          <p className="hero-subtitle">
            {slides[currentSlide].subtitle}
          </p>
          <div className="hero-buttons">
            <Link to={user ? "/dashboard/patient" : "/register"} className="btn-hero-primary">
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
            <Link to="/wellness-hub" className="btn-hero-secondary">
              Wellness Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Holistic Wellness Solutions</h2>
            <p className="section-desc">Experience comprehensive natural healthcare tailored to your lifestyle</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🤖</span>
              </div>
              <h3 className="feature-title">AI Health Assistant</h3>
              <p className="feature-text">Get instant, reliable answers to your health questions 24/7 from our advanced AI chatbot.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>✨</span>
              </div>
              <h3 className="feature-title">Wellness Hub</h3>
              <p className="feature-text">Access a unified AI-powered holistic guide for remedies, yoga, diet, and lifestyle.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>👨‍⚕️</span>
              </div>
              <h3 className="feature-title">Expert Consultations</h3>
              <p className="feature-text">Connect with certified naturopathy and homeopathy doctors for personalized treatment.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🙏</span>
              </div>
              <h3 className="feature-title">Healing Mudras</h3>
              <p className="feature-text">Discover ancient hand gestures to balance your energy and improve vitality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50k+</div>
              <div className="stat-label">Remedies Shared</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section - History */}
      <section className="info-section">
        <div className="container">
          <div className="info-card">
            <div className="info-content">
              <h2 className="section-title">The Power of Homeopathy</h2>
              <p className="feature-text">Founded by Samuel Hahnemann in 1796, homeopathy is based on the principle of "like cures like". It uses highly diluted substances to trigger the body's natural healing processes.</p>
              <Link to="/wellness-hub" className="btn" style={{ marginTop: '1rem' }}>Enter Wellness Hub</Link>
            </div>
            <div className="info-visual">
              <div className="info-visual-placeholder">🧪</div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-content">
              <h2 className="section-title">Naturopathy: Healing by Nature</h2>
              <p className="feature-text">Naturopathy focuses on natural healing methods including herbal medicine, nutrition, and lifestyle counseling to support the body's self-healing abilities, originating from the 19th century.</p>
              <Link to="/wellness-hub" className="btn" style={{ marginTop: '1rem' }}>Enter Wellness Hub</Link>
            </div>
            <div className="info-visual">
              <div className="info-visual-placeholder">🌱</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section" style={{ minHeight: '60vh', background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}>
        <div className="hero-content">
          <h2 className="hero-title">Ready to Transform Your Health?</h2>
          <p className="hero-subtitle">Join thousands of others on their journey to natural wellness today.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-secondary" style={{ background: 'white', color: '#10B981' }}>Join Healora Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
