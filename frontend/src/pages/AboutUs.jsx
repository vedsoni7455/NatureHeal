import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="page-hero">
        <div className="hero-content">
          <h1>About NatureHeal</h1>
          <p>
            Discover the power of natural healing through naturopathy and homeopathy.
            We're committed to promoting holistic wellness and natural health solutions.
          </p>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <span className="floating-icon">🌿</span>
            <span className="floating-icon">🌸</span>
            <span className="floating-icon">🧘‍♀️</span>
            <span className="floating-icon">🌱</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Our Mission</h2>
          <p>
            To empower individuals with knowledge and tools for natural healing,
            promoting wellness through naturopathy, homeopathy, and holistic practices.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🌿</span>
            <h3>Natural Remedies</h3>
            <p>
              Discover time-tested natural remedies and homeopathic treatments
              that work in harmony with your body's healing abilities.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🧘‍♀️</span>
            <h3>Yoga & Meditation</h3>
            <p>
              Explore yoga asanas and meditation techniques that promote
              physical health, mental clarity, and spiritual well-being.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👨‍⚕️</span>
            <h3>Expert Guidance</h3>
            <p>
              Connect with qualified naturopathic doctors and homeopathic
              practitioners for personalized health guidance.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered Support</h3>
            <p>
              Get instant answers to your health questions through our
              intelligent chatbot powered by advanced AI technology.
            </p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Natural Remedies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Yoga Asanas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Expert Doctors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h2>Join Our Community</h2>
            <p>
              Start your journey towards natural healing and holistic wellness today.
              Connect with like-minded individuals and expert practitioners.
            </p>
            <div className="cta-buttons">
              <a href="/register" className="cta-primary">Get Started</a>
              <a href="/remedies" className="cta-secondary">Explore Remedies</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
