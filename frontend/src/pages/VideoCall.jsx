import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import '../styles/global.css';

const VideoCall = () => {
    const { appointmentId } = useParams();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await api.get(`/appointments/${appointmentId}`);
                const apt = res.data;

                // Verify user is part of this appointment
                const userId = user._id.toString();
                const patientId = apt.patient._id.toString();
                const doctorId = apt.doctor._id.toString();

                if (patientId !== userId && doctorId !== userId) {
                    setError('You are not authorized to join this call.');
                    setLoading(false);
                    return;
                }

                // Time-based access control
                const appointmentDateTime = new Date(apt.date);
                // Parse time string (e.g., "10:00 AM")
                const [time, modifier] = apt.time.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                    hours = '00';
                }
                if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                }

                appointmentDateTime.setHours(hours, minutes, 0, 0);

                const now = new Date();
                const timeDiff = appointmentDateTime - now;
                const minutesDiff = Math.floor(timeDiff / 1000 / 60);

                // Allow 10 minutes before and up to duration (default 30 mins) after start
                const duration = apt.duration || 30;

                if (minutesDiff > 10) {
                    setError(`You can join the meeting 10 minutes before the scheduled time. (Starts in ${minutesDiff} mins)`);
                    setLoading(false);
                    return;
                } else if (minutesDiff < -duration) {
                    setError('This appointment has ended.');
                    setLoading(false);
                    return;
                }

                if (apt.meetingLink) {
                    // Redirect to the Google Meet link
                    const link = apt.meetingLink.startsWith('http') ? apt.meetingLink : `https://${apt.meetingLink}`;
                    window.location.href = link;
                } else {
                    setError('The doctor has not provided a video call link yet. Please check back later.');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching appointment:', err);
                setError('Failed to load appointment details.');
                setLoading(false);
            }
        };

        if (user) {
            fetchAppointment();
        }
    }, [appointmentId, user]);

    if (loading) return <div className="loading">Redirecting to video call...</div>;
    if (error) return (
        <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Video Call Unavailable</h2>
            <p>{error}</p>
            <button onClick={() => window.history.back()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Go Back
            </button>
        </div>
    );

    return null;
};

export default VideoCall;
