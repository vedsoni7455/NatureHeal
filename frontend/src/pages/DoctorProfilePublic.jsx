import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/doctors.css';

const DoctorProfilePublic = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/doctor/${id}`);
                setDoctor(res.data);
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError('Failed to load doctor details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctorDetails();
        }
    }, [id]);

    const toggleCertificate = (e) => {
        e.preventDefault();
        setShowCertificate(!showCertificate);
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Loading profile...</p></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!doctor) return <div className="no-doctors">Doctor not found</div>;

    const doctorDetails = doctor.doctorDetails || {};

    return (
        <div className="doctors-page">
            <div className="container">
                <div className="doctor-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                    <div className="doctor-header" style={{ flexDirection: 'column', textAlign: 'center' }}>
                        <div className="doctor-avatar">
                            {doctor.profilePicture ? (
                                <img
                                    src={doctor.profilePicture}
                                    alt={doctor.name}
                                    style={{ width: '150px', height: '150px', border: '4px solid var(--primary-color)' }}
                                />
                            ) : (
                                <span className="avatar-placeholder" style={{ width: '150px', height: '150px', fontSize: '4rem' }}>👨‍⚕️</span>
                            )}
                        </div>

                        <div className="doctor-info">
                            <div className="name-wrapper" style={{ justifyContent: 'center' }}>
                                <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)' }}>Dr. {doctor.name}</h1>
                                {doctorDetails.verificationStatus === 'Verified' && (
                                    <span className="verified-badge" title="Verified Doctor">✅</span>
                                )}
                            </div>
                            <p className="specialization" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{doctor.specialization}</p>

                            <div className="doctor-meta" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                                <span className="experience">{doctor.experience} years experience</span>
                                {doctorDetails.rating && (
                                    <span className="rating">⭐ {doctorDetails.rating.toFixed(1)} ({doctorDetails.totalReviews} reviews)</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="doctor-details" style={{ marginTop: '2rem' }}>
                        <h3>About Dr. {doctor.name}</h3>
                        <p className="bio" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                            {doctorDetails.bio || 'No biography available.'}
                        </p>

                        <div className="doctor-stats" style={{ justifyContent: 'center', margin: '2rem 0' }}>
                            {doctorDetails.consultationFee && (
                                <div className="stat">
                                    <span className="stat-label">Consultation Fee</span>
                                    <span className="stat-value" style={{ fontSize: '1.5rem' }}>${doctorDetails.consultationFee}</span>
                                </div>
                            )}
                        </div>

                        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                            <div className="contact-info">
                                <h4>Contact & Location</h4>
                                {doctor.email && <p><strong>Email:</strong> {doctor.email}</p>}
                                {doctor.phone && <p><strong>Phone:</strong> {doctor.phone}</p>}
                                {doctor.address && <p><strong>Location:</strong> {doctor.address}</p>}
                            </div>

                            <div>
                                {doctorDetails.languages && doctorDetails.languages.length > 0 && (
                                    <div className="languages">
                                        <h4>Languages</h4>
                                        <p>{doctorDetails.languages.join(', ')}</p>
                                    </div>
                                )}

                                {doctorDetails.certifications && doctorDetails.certifications.length > 0 && (
                                    <div className="certifications" style={{ marginTop: '1rem' }}>
                                        <h4>Certifications</h4>
                                        <p>{doctorDetails.certifications.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Certificate Link */}
                        {doctorDetails.verificationStatus === 'Verified' && doctorDetails.certificateImage && (
                            <div className="certificate-link" style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <button
                                    onClick={toggleCertificate}
                                    className="view-cert-btn"
                                    style={{ margin: '0 auto', padding: '10px 20px', fontSize: '1rem' }}
                                >
                                    📜 View Verified Certificate
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="doctor-actions" style={{ marginTop: '3rem' }}>
                        <Link to={`/appointment?doctor=${doctor._id}`} className="book-btn" style={{ padding: '1rem', fontSize: '1.2rem' }}>
                            Book Appointment with Dr. {doctor.name}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            {showCertificate && (
                <div className="cert-modal-overlay" onClick={toggleCertificate}>
                    <div className="cert-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="cert-modal-close" onClick={toggleCertificate}>×</button>
                        <img
                            src={doctorDetails.certificateImage}
                            alt={`Certificate for Dr. ${doctor.name}`}
                            className="cert-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfilePublic;
