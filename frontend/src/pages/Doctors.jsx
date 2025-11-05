import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import DoctorCard from '../components/DoctorCard';
import '../styles/doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDoctors();
  }, [filters, currentPage]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: currentPage,
        ...filters
      });

      const res = await api.get(`/doctor?${params}`);
      setDoctors(res.data.doctors || []);
      setTotalPages(res.data.pages || 1);
      setError('');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const specializations = [
    'Naturopathy',
    'Homeopathy',
    'Ayurveda',
    'Acupressure',
    'Acupuncture',
    'Herbal Medicine',
    'Nutrition',
    'Yoga Therapy'
  ];

  return (
    <div className="doctors-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Our Expert Doctors</h1>
          <p>Connect with certified naturopathy and homeopathy practitioners for personalized natural healthcare</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search Doctors</label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by name or specialization..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="specialization">Specialization</label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Doctors Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading doctors...</p>
          </div>
        ) : doctors.length > 0 ? (
          <>
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-doctors">
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria or check back later.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="doctors-cta">
          <h2>Ready to Book an Appointment?</h2>
          <p>Schedule a consultation with one of our expert doctors today.</p>
          <Link to="/appointment" className="cta-btn">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
