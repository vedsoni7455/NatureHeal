import React from 'react';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <h3>Dr. {doctor.name}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <p>Experience: {doctor.experience} years</p>
      <p>Email: {doctor.email}</p>
      <p>Phone: {doctor.phone}</p>
      <p>Bio: {doctor.bio}</p>
    </div>
  );
};

export default DoctorCard;
