import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api, { BASE_URL } from '../utils/api';
import '../styles/profile.css';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    height: '',
    weight: '',
    age: '',
    disease: '',
    diseaseDuration: '',
    specialization: '',
    experience: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        height: user.height || '',
        weight: user.weight || '',
        age: user.age || '',
        disease: user.disease || '',
        diseaseDuration: user.diseaseDuration || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        licenseNumber: user.licenseNumber || '',
      });

      if (user.role === 'doctor') {
        const fetchDoctorDetails = async () => {
          try {
            const res = await api.get(`/doctor/${user._id}`);
            if (res.data && res.data.doctorDetails) {
              setDoctorDetails(res.data.doctorDetails);
            }
          } catch (err) {
            console.error("Failed to fetch doctor details", err);
          }
        };
        fetchDoctorDetails();
      }
    }
  }, [user]);

  const toggleCertificate = (e) => {
    e?.preventDefault();
    setShowCertificate(!showCertificate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put('/auth/profile', formData);
      // FIXED: The API returns { user, token }, so we must set user to res.data.user
      setUser(res.data.user);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button
            onClick={toggleEdit}
            className={`btn ${isEditing ? 'secondary' : 'primary'}`}
          >
            <span style={{ marginRight: '0.5rem' }}>{isEditing ? '❌' : '✏️'}</span>
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Basic Information */}
            <div className="form-section">
              <h2>👤 Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">📧 Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">📱 Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">📍 Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {user.role === 'patient' && (
              <div className="form-section">
                <h2>⚕️ Health Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="height">📏 Height (cm)</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight">⚖️ Weight (kg)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">🎂 Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="disease">🏥 Disease/Condition</label>
                    <input
                      type="text"
                      id="disease"
                      name="disease"
                      value={formData.disease}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="diseaseDuration">⏱️ Disease Duration</label>
                    <input
                      type="text"
                      id="diseaseDuration"
                      name="diseaseDuration"
                      value={formData.diseaseDuration}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., 2 years"
                    />
                  </div>
                </div>
              </div>
            )}

            {user.role === 'doctor' && (
              <div className="form-section">
                <h2>🩺 Professional Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="specialization">Specialization</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">⏳ Experience (years)</label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="licenseNumber">🆔 License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="form-section">
              <h2>🔒 Account Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Member Since</label>
                  <input
                    type="text"
                    value={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Verification Status</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <input
                      type="text"
                      value={
                        user.role === 'doctor' && doctorDetails
                          ? doctorDetails.verificationStatus
                          : (user.isVerified ? 'Verified' : 'Not Verified')
                      }
                      style={{
                        color: user.role === 'doctor' && doctorDetails?.verificationStatus === 'Verified' ? '#1eff00' : 'inherit',
                        fontWeight: user.role === 'doctor' && doctorDetails?.verificationStatus === 'Verified' ? 'bold' : 'normal'
                      }}
                      disabled
                    />
                    {user.role === 'doctor' && doctorDetails?.verificationStatus === 'Verified' && doctorDetails.certificateImage && (
                      <button
                        onClick={toggleCertificate}
                        type="button"
                        style={{
                          alignSelf: 'flex-start',
                          background: 'none',
                          border: '1px solid #4CAF50',
                          color: '#4CAF50',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginTop: '5px'
                        }}
                      >
                        📜 View Verified Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button type="button" onClick={toggleEdit} className="btn secondary">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && doctorDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }} onClick={toggleCertificate}>
          <div style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '90vh',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px'
          }} onClick={e => e.stopPropagation()}>
            <button style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              lineHeight: '30px',
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }} onClick={toggleCertificate}>×</button>
            <img
              src={`${BASE_URL}${doctorDetails.certificateImage}`}
              alt="Verification Certificate"
              style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
