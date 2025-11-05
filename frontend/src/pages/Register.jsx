import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    height: '',
    weight: '',
    age: '',
    disease: '',
    diseaseDuration: '',
    specialization: '',
    experience: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPatientFields, setShowPatientFields] = useState(true);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');

    if (name === 'role') {
      setShowPatientFields(value === 'patient');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <span>🌱</span>
            </div>
            <h1>Join NatureHeal</h1>
            <p>Create your account to get started</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">I am a</label>
              <div className="input-wrapper">
                <span className="input-icon">🏥</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </div>

            {showPatientFields ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📏</span>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        placeholder="170"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">⚖️</span>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        placeholder="70"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age (years)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🎂</span>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      placeholder="25"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="disease">Medical Condition (if any)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏥</span>
                    <input
                      type="text"
                      id="disease"
                      name="disease"
                      placeholder="e.g., Diabetes, Hypertension"
                      value={formData.disease}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="diseaseDuration">Duration of Condition</label>
                  <div className="input-wrapper">
                    <span className="input-icon">⏱️</span>
                    <input
                      type="text"
                      id="diseaseDuration"
                      name="diseaseDuration"
                      placeholder="e.g., 2 years, 6 months"
                      value={formData.diseaseDuration}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="specialization">Specialization *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏥</span>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      placeholder="e.g., Naturopathy, Homeopathy, Ayurveda"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Years of Experience *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      placeholder="5"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📞</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
