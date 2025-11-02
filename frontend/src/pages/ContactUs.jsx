import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-us-page">
      <div className="page-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>
            Have questions about natural healing? Need guidance on naturopathy or homeopathy?
            We're here to help you on your wellness journey.
          </p>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <span className="floating-icon">📧</span>
            <span className="floating-icon">📞</span>
            <span className="floating-icon">💬</span>
            <span className="floating-icon">🌿</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="contact-content">
          <div className="contact-info">
            <div className="section-header">
              <h2>Get In Touch</h2>
              <p>
                Reach out to us through any of the following channels.
                We're committed to supporting your natural health journey.
              </p>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <span className="contact-icon">📧</span>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p>support@natureheal.com</p>
                  <p>info@natureheal.com</p>
                </div>
              </div>

              <div className="contact-method">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon-Fri: 9AM - 6PM EST</p>
                </div>
              </div>

              <div className="contact-method">
                <span className="contact-icon">📍</span>
                <div className="contact-details">
                  <h3>Visit Us</h3>
                  <p>123 Natural Health Way</p>
                  <p>Wellness City, WC 12345</p>
                </div>
              </div>

              <div className="contact-method">
                <span className="contact-icon">💬</span>
                <div className="contact-details">
                  <h3>Live Chat</h3>
                  <p>Available 24/7</p>
                  <p>Use our AI chatbot for instant help</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="section-header">
              <h2>Send us a Message</h2>
              <p>
                Have a specific question or need personalized advice?
                Fill out the form below and we'll respond promptly.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="auth-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about our services.</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Are your remedies safe?</h3>
              <p>
                Yes, all our natural remedies and homeopathic treatments are carefully
                selected and prepared according to traditional practices and modern safety standards.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do I need a prescription?</h3>
              <p>
                Most natural remedies don't require prescriptions, but we always recommend
                consulting with a healthcare professional before starting any new treatment.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I book an appointment?</h3>
              <p>
                You can book appointments through our platform by selecting a doctor
                and choosing an available time slot that works for you.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is the AI chatbot a substitute for medical advice?</h3>
              <p>
                No, our AI chatbot provides general information about natural health practices.
                It cannot diagnose conditions or provide medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
