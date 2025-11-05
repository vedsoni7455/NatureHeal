import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import '../styles/profile.css';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
    }
  }, [user]);

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
      setUser(res.data);
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
            {isEditing ? 'Cancel' : 'Edit Profile'}
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
              <h2>Basic Information</h2>
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
                  <label htmlFor="email">Email</label>
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
                  <label htmlFor="phone">Phone</label>
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
                  <label htmlFor="address">Address</label>
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
                <h2>Health Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
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
                    <label htmlFor="weight">Weight (kg)</label>
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
                    <label htmlFor="age">Age</label>
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
                    <label htmlFor="disease">Disease/Condition</label>
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
                    <label htmlFor="diseaseDuration">Disease Duration</label>
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
                <h2>Professional Information</h2>
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
                    <label htmlFor="experience">Experience (years)</label>
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
                    <label htmlFor="licenseNumber">License Number</label>
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
              <h2>Account Information</h2>
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
                  <input
                    type="text"
                    value={user.isVerified ? 'Verified' : 'Not Verified'}
                    disabled
                  />
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
    </div>
  );
};

export default Profile;
