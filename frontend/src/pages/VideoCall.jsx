import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import '../styles/global.css';

const VideoCall = () => {
    const { appointmentId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await api.get(`/appointments/${appointmentId}`);
                setAppointment(res.data);

                // Verify user is part of this appointment
                if (res.data.patient._id !== user._id && res.data.doctor._id !== user._id) {
                    setError('You are not authorized to join this call.');
                }
            } catch (err) {
                console.error('Error fetching appointment:', err);
                setError('Failed to load appointment details.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAppointment();
        }
    }, [appointmentId, user]);

    useEffect(() => {
        if (!loading && !error && appointment) {
            const initJitsi = () => {
                const domain = 'meet.jit.si';
                const options = {
                    roomName: `Healora-Appointment-${appointmentId}`,
                    width: '100%',
                    height: '100%',
                    parentNode: document.getElementById('jitsi-container'),
                    userInfo: {
                        displayName: user.name,
                        email: user.email
                    },
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    },
                };

                const api = new window.JitsiMeetExternalAPI(domain, options);

                api.addEventListeners({
                    videoConferenceLeft: () => {
                        navigate(user.role === 'doctor' ? '/doctor/appointments' : '/dashboard/patient');
                    },
                });
            };

            // Load Jitsi script
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = initJitsi;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [loading, error, appointment, appointmentId, user, navigate]);

    if (loading) return <div className="loading">Loading call details...</div>;
    if (error) return <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ height: 'calc(100vh - 80px)', width: '100%', background: '#000' }}>
            <div id="jitsi-container" style={{ height: '100%', width: '100%' }}></div>
        </div>
    );
};

export default VideoCall;
