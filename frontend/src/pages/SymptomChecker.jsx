import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api'; // Import API utility
import '../styles/symptom-checker.css';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('mild');
  const [duration, setDuration] = useState('1-3 days');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(''); // Add error state

  const symptoms = [
    { id: 'headache', name: 'Headache', category: 'pain' },
    { id: 'fever', name: 'Fever', category: 'infection' },
    { id: 'cough', name: 'Cough', category: 'respiratory' },
    { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory' },
    { id: 'nausea', name: 'Nausea', category: 'digestive' },
    { id: 'fatigue', name: 'Fatigue', category: 'general' },
    { id: 'dizziness', name: 'Dizziness', category: 'neurological' },
    { id: 'chest_pain', name: 'Chest Pain', category: 'cardiac' },
    { id: 'short_breath', name: 'Shortness of Breath', category: 'respiratory' },
    { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'digestive' },
    { id: 'joint_pain', name: 'Joint Pain', category: 'musculoskeletal' },
    { id: 'skin_rash', name: 'Skin Rash', category: 'dermatological' },
    { id: 'insomnia', name: 'Insomnia', category: 'sleep' },
    { id: 'anxiety', name: 'Anxiety', category: 'mental' },
    { id: 'depression', name: 'Depression', category: 'mental' },
    { id: 'weight_loss', name: 'Unexplained Weight Loss', category: 'metabolic' }
  ];

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    setError('');
    setResults(null);

    // Map IDs to Names for better AI context
    const symptomNames = selectedSymptoms.map(id =>
      symptoms.find(s => s.id === id)?.name
    );

    try {
      const res = await api.post('/ai/analyze-symptoms', {
        symptoms: symptomNames,
        severity,
        duration
      });

      setResults({
        ...res.data,
        selectedSymptoms: symptomNames.join(', ')
      });
    } catch (err) {
      console.error('Symptom Analysis Failed:', err);
      setError('Failed to analyze symptoms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    if (!urgency) return 'blue';
    switch (urgency.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <div className="symptom-checker-page">
      <div className="container">
        <div className="symptom-checker-hero">
          <h1>AI Symptom Checker</h1>
          <p>Describe your symptoms and let our advanced AI provide a preliminary assessment.</p>
        </div>

        <div className="symptom-checker-content">
          <div className="symptom-form-section">
            <h2>Select Your Symptoms</h2>
            <p>Choose all symptoms that apply to you currently:</p>

            <div className="symptoms-grid">
              {symptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className={`symptom-item ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}
                  onClick={() => handleSymptomToggle(symptom.id)}
                >
                  <div className="symptom-checkbox"></div>
                  <div className="symptom-info">
                    <h3>{symptom.name}</h3>
                    <p>{symptom.category}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="1-3 days">1-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="more than 1 month">More than 1 month</option>
                </select>
              </div>
            </div>

            <button
              className="analyze-btn"
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </button>

            {error && <div className="error-message" style={{ marginTop: '1rem', color: 'var(--error)' }}>{error}</div>}
          </div>

          {results && (
            <div className="results-section">
              <h2>Analysis Results</h2>
              <div className={`results-card urgency-${results.urgency?.toLowerCase() || 'medium'}`}>
                <div className="result-header">
                  <h3>{results.condition}</h3>
                  <span className={`urgency-badge ${getUrgencyColor(results.urgency)}`}>
                    {results.urgency?.toUpperCase()} URGENCY
                  </span>
                </div>

                <div className="result-details">
                  <p><strong>Selected Symptoms:</strong> {results.selectedSymptoms}</p>
                  <p><strong>Explanation:</strong> {results.explanation}</p>
                </div>

                {results.warningSigns && results.warningSigns.length > 0 && (
                  <div className="warning-signs" style={{ backgroundColor: '#FFF5F5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--error)' }}>
                    <h4 style={{ color: 'var(--error)', marginTop: 0 }}>⚠️ Warning Signs</h4>
                    <ul style={{ marginBottom: 0 }}>
                      {results.warningSigns.map((sign, index) => (
                        <li key={index}>{sign}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="recommendations">
                  <h4>Recommendations:</h4>
                  <ul>
                    {results.recommendations?.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="disclaimer">
                <h4>⚠️ Important Disclaimer</h4>
                <p>
                  This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice,
                  diagnosis, or treatment. Always seek the advice of your physician.
                </p>
              </div>

              <div className="next-steps">
                <h3>What to do next?</h3>
                <div className="next-steps-grid">
                  <Link to="/appointment" className="next-step-card">
                    <span className="step-icon">👨‍⚕️</span>
                    <h4>Book Appointment</h4>
                    <p>Consult with a healthcare professional</p>
                  </Link>
                  <Link to="/chatbot" className="next-step-card">
                    <span className="step-icon">🤖</span>
                    <h4>AI Health Assistant</h4>
                    <p>Get instant guidance from our AI</p>
                  </Link>
                  <Link to="/wellness-hub" className="next-step-card" style={{ background: 'var(--primary-5)', border: '1px solid var(--primary-50)' }}>
                    <span className="step-icon">✨</span>
                    <h4>AI Wellness Hub</h4>
                    <p>Get a full plan covering yoga, diet, and mudras</p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
