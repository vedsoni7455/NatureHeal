import React from 'react';

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <h3>Appointment with Dr. {appointment.doctor.name}</h3>
      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
      <p>Time: {appointment.time}</p>
      <p>Type: {appointment.type}</p>
      <p>Status: {appointment.status}</p>
      {appointment.notes && <p>Notes: {appointment.notes}</p>}
    </div>
  );
};

export default AppointmentCard;
