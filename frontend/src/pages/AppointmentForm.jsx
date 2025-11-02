import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DoctorCard from '../components/DoctorCard';

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    type: 'video',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctor');
        setDoctors(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      alert('Appointment booked successfully!');
      navigate('/dashboard/patient');
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>
      <div className="doctors-list">
        <h3>Available Doctors</h3>
        {doctors.map(doctor => <DoctorCard key={doctor._id} doctor={doctor} />)}
      </div>
      <form onSubmit={handleSubmit}>
        <select name="doctor" value={formData.doctor} onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>Dr. {doctor.name}</option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="video">Video Call</option>
          <option value="voice">Voice Call</option>
          <option value="message">Message</option>
        </select>
        <textarea
          name="notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
