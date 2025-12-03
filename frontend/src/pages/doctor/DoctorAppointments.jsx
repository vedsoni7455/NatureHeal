import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import '../../styles/global.css';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, completed, cancelled
    const [message, setMessage] = useState('');

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all appointments and filter client-side or use backend filters if available
            // The backend supports status filter.
            // For "upcoming", we want pending and confirmed.
            // For "completed", we want completed.
            // For "cancelled", we want cancelled.

            let statusFilter = '';
            if (activeTab === 'completed') statusFilter = 'completed';
            else if (activeTab === 'cancelled') statusFilter = 'cancelled';

            // For upcoming, we might need to fetch all and filter, or fetch pending and confirmed separately.
            // Let's fetch all for now and filter client side for simplicity if the list isn't huge, 
            // or better, use the status param if we can pass multiple.
            // Backend controller: if (status) query.status = status; -> supports single status.

            let res;
            if (activeTab === 'upcoming') {
                // Fetch pending and confirmed. We'll fetch all and filter.
                res = await api.get('/doctor/appointments');
            } else {
                res = await api.get(`/doctor/appointments?status=${statusFilter}`);
            }

            let fetchedAppointments = res.data.appointments;

            if (activeTab === 'upcoming') {
                fetchedAppointments = fetchedAppointments.filter(apt =>
                    apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'rescheduled'
                );
            }

            setAppointments(fetchedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setMessage('Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}`, { status: newStatus });
            setMessage(`Appointment ${newStatus} successfully.`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error(`Error updating appointment to ${newStatus}:`, error);
            setMessage('Failed to update appointment status.');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="dashboard-header">
                <h1>My Appointments</h1>
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {message && (
                <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`} style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: message.includes('Failed') ? '#fee2e2' : 'var(--secondary-100)',
                    color: message.includes('Failed') ? '#dc2626' : 'var(--primary-700)'
                }}>
                    {message}
                </div>
            )}

            {loading ? (
                <div className="loading">Loading appointments...</div>
            ) : appointments.length > 0 ? (
                <div className="appointments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.map(apt => (
                        <div key={apt._id} className="appointment-card" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--neutral-200)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{apt.patient?.name || 'Unknown Patient'}</h3>
                                    <p style={{ color: 'var(--neutral-700)', marginBottom: '0.25rem' }}>
                                        <strong>Date:</strong> {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                    </p>
                                    <p style={{ color: 'var(--neutral-700)', marginBottom: '0.25rem' }}>
                                        <strong>Type:</strong> {apt.type}
                                    </p>
                                    {apt.symptoms && apt.symptoms.length > 0 && (
                                        <p style={{ color: 'var(--neutral-700)', marginBottom: '0.25rem' }}>
                                            <strong>Symptoms:</strong> {apt.symptoms.join(', ')}
                                        </p>
                                    )}
                                    {apt.notes && (
                                        <p style={{ color: 'var(--neutral-700)', fontStyle: 'italic' }}>
                                            "{apt.notes}"
                                        </p>
                                    )}
                                    {apt.attachments && apt.attachments.length > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <strong>Attachments: </strong>
                                            {apt.attachments.map((att, index) => (
                                                <a key={index} href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-600)', marginRight: '0.5rem' }}>
                                                    {att.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="actions" style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '150px' }}>
                                    <span className={`status-badge ${apt.status}`} style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        backgroundColor:
                                            apt.status === 'confirmed' ? '#dcfce7' :
                                                apt.status === 'pending' ? '#fef9c3' :
                                                    apt.status === 'completed' ? '#dbeafe' : '#fee2e2',
                                        color:
                                            apt.status === 'confirmed' ? '#166534' :
                                                apt.status === 'pending' ? '#854d0e' :
                                                    apt.status === 'completed' ? '#1e40af' : '#991b1b'
                                    }}>
                                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                    </span>

                                    {activeTab === 'upcoming' && (
                                        <>
                                            {apt.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusChange(apt._id, 'confirmed')}
                                                    className="btn"
                                                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusChange(apt._id, 'cancelled')}
                                                className="btn"
                                                style={{ padding: '0.5rem', fontSize: '0.9rem', background: '#fee2e2', color: '#991b1b' }}
                                            >
                                                Cancel
                                            </button>
                                            {apt.status === 'confirmed' && (
                                                <>
                                                    <button
                                                        onClick={() => window.open(`/video-call/${apt._id}`, '_blank')}
                                                        className="btn"
                                                        style={{ padding: '0.5rem', fontSize: '0.9rem', background: '#3b82f6', color: 'white', marginBottom: '0.5rem' }}
                                                    >
                                                        Join Video Call
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(apt._id, 'completed')}
                                                        className="btn"
                                                        style={{ padding: '0.5rem', fontSize: '0.9rem', background: '#dbeafe', color: '#1e40af' }}
                                                    >
                                                        Mark Complete
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                    <p>No {activeTab} appointments found.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
