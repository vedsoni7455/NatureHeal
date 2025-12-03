import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);

      // Redirect based on role
      if (user.role === 'doctor') {
        navigate('/dashboard/doctor'); // Direct to doctor dashboard
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/', { state: { welcomeMessage: `Welcome back, ${user.name}!` } });
      }
    } catch (error) {
      console.error('Login Error:', error);
      let errorMsg = 'Login failed';

      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMsg = `Server Error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = `Network Error: No response from server. URL: ${error.config?.baseURL || ''}${error.config?.url || ''}`;
      } else {
        // Something happened in setting up the request
        errorMsg = `Error: ${error.message}`;
      }

      setError(errorMsg);
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

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
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
