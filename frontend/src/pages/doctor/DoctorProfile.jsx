import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext'; // Not currently used
import api from '../../utils/api';
import '../../styles/global.css'; // Ensure global styles are applied

const DoctorProfile = () => {
    // const { user, login } = useContext(AuthContext); // Not currently used
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        bio: '',
        consultationFee: '',
        languages: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch user profile
                const userRes = await api.get('/auth/profile');
                const userData = userRes.data;

                // Fetch doctor specific details if available
                let doctorDetails = {};
                try {
                    // We might need a specific endpoint or just rely on what's in user object if populated
                    // The backend updateDoctorProfile returns everything, but let's see if we can get it.
                    // The getDoctorById endpoint is public, we can use that if we have the ID.
                    const docRes = await api.get(`/doctor/${userData._id}`);
                    doctorDetails = docRes.data.doctorDetails || {};
                } catch (err) {
                    console.log("Could not fetch extra doctor details", err);
                }

                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    specialization: userData.specialization || '',
                    experience: userData.experience || '',
                    licenseNumber: userData.licenseNumber || '',
                    bio: doctorDetails.bio || '',
                    consultationFee: doctorDetails.consultationFee || '',
                    languages: doctorDetails.languages ? doctorDetails.languages.join(', ') : '',
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            // Prepare data for submission
            const dataToSubmit = {
                ...formData,
                languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
            };

            await api.put('/doctor/profile', dataToSubmit);

            // Update local user context if needed (optional, but good practice)
            // Assuming login function can accept user object to update state without token
            // Or we just rely on the fact that the backend is updated.

            setMessage('Profile updated successfully!');
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="auth-header">
                    <h1>Edit Profile</h1>
                    <p>Update your professional information</p>
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
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📍</span>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="specialization">Specialization</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👨‍⚕️</span>
                                <input
                                    type="text"
                                    id="specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="experience">Experience (Years)</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📚</span>
                                <input
                                    type="number"
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="licenseNumber">License Number</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🆔</span>
                                <input
                                    type="text"
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="consultationFee">Consultation Fee ($)</label>
                            <div className="input-wrapper">
                                <span className="input-icon">💲</span>
                                <input
                                    type="number"
                                    id="consultationFee"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="languages">Languages (comma separated)</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🗣️</span>
                            <input
                                type="text"
                                id="languages"
                                name="languages"
                                value={formData.languages}
                                onChange={handleChange}
                                placeholder="English, Spanish, French"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Professional Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="form-control"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--neutral-200)',
                                borderRadius: 'var(--radius-md)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="auth-btn" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="auth-btn"
                            onClick={() => navigate('/dashboard/doctor')}
                            style={{ flex: 1, background: 'var(--neutral-200)', color: 'var(--neutral-700)' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
