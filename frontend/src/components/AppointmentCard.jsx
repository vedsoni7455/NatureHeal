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
        // Time check logic
        const appointmentDateTime = new Date(appointment.date);
        const [time, modifier] = appointment.time.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        appointmentDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const timeDiff = appointmentDateTime - now;
        const minutesDiff = Math.floor(timeDiff / 1000 / 60);
        const duration = appointment.duration || 30;

        const isTooEarly = minutesDiff > 10;
        const isEnded = minutesDiff < -duration;

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
                  Join in {minutesDiff} mins
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
              className="btn"
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                textDecoration: 'none',
                fontSize: '0.9rem',
                backgroundColor: '#34a853',
                color: 'white',
                textAlign: 'center'
              }}
            >
              Join Google Meet
            </a>
          );
        } else {
          return (
            <button
              disabled
              className="btn"
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                fontSize: '0.9rem',
                opacity: 0.7,
                cursor: 'not-allowed',
                backgroundColor: '#ccc'
              }}
            >
              Video Link Pending
            </button>
          );
        }
      })()}
    </div>
  );
};

export default AppointmentCard;
