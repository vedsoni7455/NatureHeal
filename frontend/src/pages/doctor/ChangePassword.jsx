import React, { useState } from 'react';
import api from '../../utils/api';
import '../../styles/global.css';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/profile', { password: formData.password });
            setMessage('Password updated successfully!');
            setFormData({ password: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="auth-header">
                    <h1>Change Password</h1>
                    <p>Update your login credentials</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`} style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        backgroundColor: message.includes('success') ? 'var(--secondary-100)' : '#fee2e2',
                        color: message.includes('success') ? 'var(--primary-700)' : '#dc2626',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
