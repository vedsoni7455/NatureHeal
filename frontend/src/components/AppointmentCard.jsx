import React from 'react';


const AppointmentCard = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <h3>Appointment with {appointment.doctor ? `Dr. ${appointment.doctor.name}` : 'Unknown Doctor'}</h3>
      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
      <p>Time: {appointment.time}</p>
      <p>Type: {appointment.type}</p>
      <p>Status: {appointment.status}</p>
      {appointment.notes && <p>Notes: {appointment.notes}</p>}
      {appointment.status === 'confirmed' && (() => {
        // Robsut Time check logic
        const [year, month, day] = appointment.date.split('T')[0].split('-');
        const appointmentDate = new Date(year, month - 1, day);

        let hours, minutes;

        // Handle both "14:30" and "02:30 PM" formats
        if (appointment.time.includes('AM') || appointment.time.includes('PM')) {
          const [time, modifier] = appointment.time.split(' ');
          [hours, minutes] = time.split(':').map(Number);
          if (hours === 12 && modifier === 'AM') hours = 0;
          if (modifier === 'PM' && hours !== 12) hours += 12;
        } else {
          [hours, minutes] = appointment.time.split(':').map(Number);
        }

        appointmentDate.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const timeDiff = appointmentDate - now; // Negative if past
        const minutesUntilStart = Math.floor(timeDiff / 1000 / 60);
        const duration = appointment.duration || 30;

        const isTooEarly = minutesUntilStart > 10;
        const isEnded = minutesUntilStart < -duration;

        if (isEnded) return (
          <button disabled className="btn" style={{ marginTop: '1rem', display: 'inline-block', fontSize: '0.9rem', opacity: 0.7, backgroundColor: '#9ca3af', cursor: 'not-allowed' }}>
            Ended
          </button>
        );

        if (appointment.meetingLink) {
          if (isTooEarly) {
            return (
              <div style={{ marginTop: '1rem' }}>
                <button disabled className="btn" style={{ fontSize: '0.9rem', opacity: 0.7, backgroundColor: '#9ca3af', cursor: 'not-allowed' }}>
                  Join in {minutesUntilStart} mins
                </button>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Link available 10 mins before</p>
              </div>
            );
          }
          return (
            <a
              href={appointment.meetingLink.startsWith('http') ? appointment.meetingLink : `https://${appointment.meetingLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn join-btn"
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                textDecoration: 'none',
                fontSize: '0.9rem',
                backgroundColor: '#34a853',
                color: 'white',
                textAlign: 'center',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Join Google Meet
            </a>
          );
        } else {
          return (
            <div style={{ marginTop: '1rem' }}>
              <button
                disabled
                className="btn"
                style={{
                  display: 'inline-block',
                  fontSize: '0.9rem',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                  backgroundColor: '#ccc'
                }}
              >
                Video Link Pending
              </button>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>The doctor will add the link soon.</p>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default AppointmentCard;
