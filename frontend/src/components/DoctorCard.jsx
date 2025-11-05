import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const doctorDetails = doctor.doctorDetails || {};

  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <div className="doctor-avatar">
          {doctor.profilePicture ? (
            <img src={doctor.profilePicture} alt={doctor.name} />
          ) : (
            <span className="avatar-placeholder">👨‍⚕️</span>
          )}
        </div>
        <div className="doctor-info">
          <h3>Dr. {doctor.name}</h3>
          <p className="specialization">{doctor.specialization}</p>
          <div className="doctor-meta">
            <span className="experience">{doctor.experience} years experience</span>
            {doctorDetails.rating && (
              <span className="rating">⭐ {doctorDetails.rating.toFixed(1)} ({doctorDetails.totalReviews} reviews)</span>
            )}
          </div>
        </div>
      </div>

      <div className="doctor-details">
        {doctorDetails.bio && (
          <p className="bio">{doctorDetails.bio}</p>
        )}

        <div className="doctor-stats">
          {doctor.totalAppointments && (
            <div className="stat">
              <span className="stat-label">Appointments</span>
              <span className="stat-value">{doctor.totalAppointments}</span>
            </div>
          )}
          {doctorDetails.consultationFee && (
            <div className="stat">
              <span className="stat-label">Consultation Fee</span>
              <span className="stat-value">${doctorDetails.consultationFee}</span>
            </div>
          )}
        </div>

        <div className="contact-info">
          {doctor.email && (
            <p><strong>Email:</strong> {doctor.email}</p>
          )}
          {doctor.phone && (
            <p><strong>Phone:</strong> {doctor.phone}</p>
          )}
          {doctor.address && (
            <p><strong>Location:</strong> {doctor.address}</p>
          )}
        </div>

        {doctorDetails.languages && doctorDetails.languages.length > 0 && (
          <div className="languages">
            <strong>Languages:</strong> {doctorDetails.languages.join(', ')}
          </div>
        )}

        {doctorDetails.certifications && doctorDetails.certifications.length > 0 && (
          <div className="certifications">
            <strong>Certifications:</strong> {doctorDetails.certifications.join(', ')}
          </div>
        )}
      </div>

      <div className="doctor-actions">
        <Link to={`/appointment?doctor=${doctor._id}`} className="book-btn">
          Book Appointment
        </Link>
        <Link to={`/doctor/${doctor._id}`} className="view-profile-btn">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
