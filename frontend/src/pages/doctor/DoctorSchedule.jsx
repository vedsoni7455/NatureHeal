import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../../styles/global.css';

const DoctorSchedule = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await api.get('/doctor/availability');
                // Ensure we have an entry for each day
                const fetchedAvailability = res.data || [];
                const fullAvailability = daysOfWeek.map(day => {
                    const existing = fetchedAvailability.find(a => a.day === day);
                    return existing || { day, isAvailable: false, startTime: '09:00', endTime: '17:00' };
                });
                setAvailability(fullAvailability);
            } catch (error) {
                console.error('Error fetching availability:', error);
                setMessage('Failed to load schedule.');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, []);

    const handleChange = (index, field, value) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            // Filter out unavailable days or send all? 
            // The backend likely replaces the array. Let's send all.
            await api.put('/doctor/availability', { availability });
            setMessage('Schedule updated successfully!');
        } catch (error) {
            console.error('Error updating schedule:', error);
            setMessage('Failed to update schedule.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && availability.length === 0) {
        return <div className="loading">Loading schedule...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="auth-header">
                    <h1>Manage Schedule</h1>
                    <p>Set your weekly availability</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`} style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        backgroundColor: message.includes('success') ? 'var(--secondary-100)' : '#fee2e2',
                        color: message.includes('success') ? 'var(--primary-700)' : '#dc2626',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <div className="schedule-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {availability.map((slot, index) => (
                        <div key={slot.day} className="schedule-row" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'var(--neutral-50)',
                            borderRadius: 'var(--radius-md)',
                            border: slot.isAvailable ? '1px solid var(--primary-200)' : '1px solid transparent'
                        }}>
                            <div style={{ minWidth: '120px', fontWeight: '600' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={slot.isAvailable}
                                        onChange={(e) => handleChange(index, 'isAvailable', e.target.checked)}
                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                    />
                                    {slot.day}
                                </label>
                            </div>

                            {slot.isAvailable ? (
                                <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
                                    <div className="time-input">
                                        <label style={{ fontSize: '0.8rem', color: 'var(--neutral-600)' }}>Start</label>
                                        <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--neutral-300)' }}
                                        />
                                    </div>
                                    <span>to</span>
                                    <div className="time-input">
                                        <label style={{ fontSize: '0.8rem', color: 'var(--neutral-600)' }}>End</label>
                                        <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--neutral-300)' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--neutral-500)', fontStyle: 'italic' }}>
                                    Not Available
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="form-actions" style={{ marginTop: '2rem' }}>
                    <button
                        onClick={handleSave}
                        className="auth-btn"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Saving...' : 'Save Schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;
