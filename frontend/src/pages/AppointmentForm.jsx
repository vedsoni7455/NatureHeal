import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DoctorCard from '../components/DoctorCard';
import '../styles/appointment.css';

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    type: 'video',
    notes: ''
  });
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctor');
        setDoctors(res.data.doctors || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
        setLoading(false);
        setMessage('Failed to load doctors. Please try again.');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.doctor && formData.date) {
        setLoadingSlots(true);
        try {
          const res = await api.get(`/doctor/${formData.doctor}/slots?date=${formData.date}`);
          setSlots(res.data || []);
        } catch (error) {
          console.error('Error fetching slots:', error);
          setSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        setSlots([]);
      }
    };
    fetchSlots();
  }, [formData.doctor, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setReport(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (report) {
      data.append('report', report);
    }

    try {
      await api.post('/appointments', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/dashboard/patient');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>

      {message && (
        <div className={message.includes('successfully') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      <div className="doctors-list">
        <h3>Available Doctors</h3>
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : doctors.length > 0 ? (
          <div className="doctors-grid">
            {doctors.map(doctor => <DoctorCard key={doctor._id} doctor={doctor} />)}
          </div>
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Appointment Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doctor">Select Doctor</label>
              <select name="doctor" id="doctor" value={formData.doctor} onChange={handleChange} required>
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>Dr. {doctor.name} - {doctor.specialization}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Appointment Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="time">Appointment Time (30 mins)</label>
              {loadingSlots ? (
                <div>Loading slots...</div>
              ) : (
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={!formData.doctor || !formData.date || slots.length === 0}
                >
                  <option value="">Select a time slot</option>
                  {slots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              )}
              {formData.doctor && formData.date && !loadingSlots && slots.length === 0 && (
                <small style={{ color: 'red' }}>No slots available for this date.</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="type">Consultation Type</label>
              <select name="type" id="type" value={formData.type} onChange={handleChange}>
                <option value="video">Video Call</option>
                <option value="voice">Voice Call</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Please describe your symptoms or concerns..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="report">Past Reports (PDF)</label>
            <input
              type="file"
              id="report"
              name="report"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !formData.time}>
          {loading ? 'Loading...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
