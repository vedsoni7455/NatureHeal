import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <h3>Appointment with {appointment.doctor ? `Dr. ${appointment.doctor.name}` : 'Unknown Doctor'}</h3>
      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
      <p>Time: {appointment.time}</p>
      <p>Type: {appointment.type}</p>
      <p>Status: {appointment.status}</p>
      {appointment.notes && <p>Notes: {appointment.notes}</p>}
      {appointment.status === 'confirmed' && (
        <Link to={`/video-call/${appointment._id}`} className="btn" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none', fontSize: '0.9rem' }}>
          Join Video Call
        </Link>
      )}
    </div>
  );
};

export default AppointmentCard;
