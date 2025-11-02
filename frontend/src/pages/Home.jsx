import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/history.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to NatureHeal",
      subtitle: "Your Journey to Natural Wellness Begins Here",
      description: "Discover the power of natural healing through naturopathy and homeopathy.",
      cta: "Get Started",
      link: "/register",
      bgImage: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)"
    },
    {
      title: "Personalized Health Solutions",
      subtitle: "Tailored Care for Your Unique Needs",
      description: "Share your health details and receive personalized natural remedies and wellness plans.",
      cta: "Learn More",
      link: "/remedies",
      bgImage: "linear-gradient(135deg, #3498db 0%, #5dade2 100%)"
    },
    {
      title: "Expert Doctor Consultations",
      subtitle: "Connect with Experienced Naturopaths",
      description: "Book appointments with certified naturopathy and homeopathy practitioners.",
      cta: "Book Now",
      link: "/appointment",
      bgImage: "linear-gradient(135deg, #9b59b6 0%, #bb8fce 100%)"
    },
    {
      title: "AI-Powered Health Assistant",
      subtitle: "Get Instant Health Guidance",
      description: "Ask our intelligent chatbot for natural remedies and wellness advice 24/7.",
      cta: "Try Now",
      link: "/chatbot",
      bgImage: "linear-gradient(135deg, #e74c3c 0%, #ec7063 100%)"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home">
      {/* Hero Slideshow */}
      <section className="hero-slideshow">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.bgImage }}
            >
              <div className="slide-content">
                <div className="slide-text">
                  <h1 className="slide-title">
                    {user ? `Welcome back, ${user.name}!` : slide.title}
                  </h1>
                  <h2 className="slide-subtitle">
                    {user ? "Continue Your Natural Wellness Journey" : slide.subtitle}
                  </h2>
                  <p className="slide-description">{slide.description}</p>
                  <Link to={slide.link} className="slide-cta">
                    {slide.cta}
                    <span className="cta-arrow">→</span>
                  </Link>
                </div>
                <div className="slide-visual">
                  <div className="floating-elements">
                    <div className="floating-icon">🌿</div>
                    <div className="floating-icon">🌸</div>
                    <div className="floating-icon">🧘‍♀️</div>
                    <div className="floating-icon">🌱</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="slide-nav prev" onClick={prevSlide}>
            <span>‹</span>
          </button>
          <button className="slide-nav next" onClick={nextSlide}>
            <span>›</span>
          </button>

          {/* Slide Indicators */}
          <div className="slide-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose NatureHeal?</h2>
            <p>Experience holistic healthcare with our comprehensive natural wellness solutions</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span>📊</span>
              </div>
              <h3>Personalized Assessment</h3>
              <p>Share your health details and receive tailored natural health recommendations based on your unique profile.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>🏠</span>
              </div>
              <h3>Home Remedies</h3>
              <p>Access our extensive collection of proven home remedies for common ailments, backed by traditional wisdom.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>🧘‍♀️</span>
              </div>
              <h3>Yoga & Meditation</h3>
              <p>Practice guided yoga asanas and meditation techniques for physical and mental well-being.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>👨‍⚕️</span>
              </div>
              <h3>Expert Consultations</h3>
              <p>Connect with certified naturopathy and homeopathy doctors for personalized treatment plans.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>🤖</span>
              </div>
              <h3>AI Health Assistant</h3>
              <p>Get instant, reliable answers to your health questions from our advanced AI chatbot.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>📱</span>
              </div>
              <h3>Mobile Access</h3>
              <p>Access your health information and book appointments anytime, anywhere with our mobile-friendly platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* History of Natural Healing Section */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>History of Natural Healing</h2>
            <p>Discover the rich heritage of homeopathy and naturopathy that forms the foundation of NatureHeal</p>
          </div>

          <div className="history-grid">
            <div className="history-card">
              <div className="history-icon">
                <span>🏥</span>
              </div>
              <h3>Homeopathy</h3>
              <p>Founded by Samuel Hahnemann in 1796, homeopathy is based on the principle of "like cures like" - using highly diluted substances that would cause symptoms in healthy people to treat similar symptoms in illness.</p>
              <div className="history-timeline">
                <div className="timeline-item">
                  <span className="year">1796</span>
                  <span className="event">Founded by Samuel Hahnemann</span>
                </div>
                <div className="timeline-item">
                  <span className="year">1810</span>
                  <span className="event">Publication of Organon of Medicine</span>
                </div>
                <div className="timeline-item">
                  <span className="year">Today</span>
                  <span className="event">Global practice in natural healing</span>
                </div>
              </div>
            </div>

            <div className="history-card">
              <div className="history-icon">
                <span>🌿</span>
              </div>
              <h3>Naturopathy</h3>
              <p>Naturopathy emerged in the 19th century in Europe and America, focusing on natural healing methods including herbal medicine, nutrition, lifestyle counseling, and physical therapies to support the body's self-healing abilities.</p>
              <div className="history-timeline">
                <div className="timeline-item">
                  <span className="year">19th Century</span>
                  <span className="event">Roots in Europe and America</span>
                </div>
                <div className="timeline-item">
                  <span className="year">1902</span>
                  <span className="event">First naturopathy school established</span>
                </div>
                <div className="timeline-item">
                  <span className="year">Today</span>
                  <span className="event">Integrated holistic healthcare approach</span>
                </div>
              </div>
            </div>

            <div className="history-card">
              <div className="history-icon">
                <span>💆‍♀️</span>
              </div>
              <h3>Acupressure</h3>
              <p>Acupressure is an ancient Chinese healing technique that uses finger pressure on specific points along the body's meridians to promote healing and relieve pain. It shares roots with acupuncture but uses manual pressure instead of needles.</p>
              <div className="history-timeline">
                <div className="timeline-item">
                  <span className="year">2700 BC</span>
                  <span className="event">Origins in ancient China</span>
                </div>
                <div className="timeline-item">
                  <span className="year">200 BC</span>
                  <span className="event">Documented in Huangdi Neijing</span>
                </div>
                <div className="timeline-item">
                  <span className="year">Today</span>
                  <span className="event">Popular complementary therapy worldwide</span>
                </div>
              </div>
            </div>

            <div className="history-card">
              <div className="history-icon">
                <span>🪡</span>
              </div>
              <h3>Acupuncture</h3>
              <p>Acupuncture is a traditional Chinese medicine technique that involves inserting thin needles into specific points on the body to balance energy flow and promote healing. It's based on the concept of qi and meridians.</p>
              <div className="history-timeline">
                <div className="timeline-item">
                  <span className="year">100 BC</span>
                  <span className="event">First documented use in China</span>
                </div>
                <div className="timeline-item">
                  <span className="year">1971</span>
                  <span className="event">Introduced to the West by James Reston</span>
                </div>
                <div className="timeline-item">
                  <span className="year">Today</span>
                  <span className="event">Recognized by WHO for various conditions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Remedies Shared</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Natural Healing Journey?</h2>
            <p>Join thousands of people who have transformed their health with NatureHeal</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-primary">Get Started Free</Link>
              <Link to="/remedies" className="cta-secondary">Explore Remedies</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
