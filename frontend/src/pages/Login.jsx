import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in - Removed to ensure credentials are always asked for
  /*
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'doctor') navigate('/dashboard/doctor');
      else if (user.role === 'admin') navigate('/dashboard/admin');
      else navigate('/');
    }
  }, [user, loading, navigate]);
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const loggedInUser = await login(formData.email, formData.password);

      // Enforce Role Match
      if (loggedInUser.role !== formData.role) {
        // Automatically logout if role doesn't match to clear the session
        localStorage.removeItem('token');

        throw new Error(`Unauthorized: This account is registered as a ${loggedInUser.role}, not a ${formData.role}.`);
      }

      // Redirect based on role
      if (loggedInUser.role === 'doctor') {
        navigate('/dashboard/doctor'); // Direct to doctor dashboard
      } else if (loggedInUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/', { state: { welcomeMessage: `Welcome back, ${loggedInUser.name}!` } });
      }
    } catch (error) {
      console.error('Login Error Full Object:', error);
      if (error.response) {
        console.error('Server Response Data:', error.response.data);
        console.error('Server Response Status:', error.response.status);
      }

      let errorMsg = 'Login failed';

      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMsg = `Server Error (${error.response.status}): ${error.response.data?.message || 'Unknown server error'}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = `Network Error: No response from server. Please check your internet connection.`;
      } else {
        // Something happened in setting up the request
        errorMsg = error.message;
      }

      setError(errorMsg);
    } finally {
      // Only set loading to false if we didn't redirect (component might unmount on redirect)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <span>🌿</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your NatureHeal account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{ wordBreak: 'break-word', fontSize: '0.8rem' }}>
                {error}
                <br />
                <small>{new Date().toLocaleTimeString()}</small>
              </div>
            )}

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Login as</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
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

            <button type="submit" className="auth-btn" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
