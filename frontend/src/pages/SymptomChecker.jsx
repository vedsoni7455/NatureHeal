import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/symptom-checker.css';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('mild');
  const [duration, setDuration] = useState('1-3 days');
  const [results, setResults] = useState(null);

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

  const analyzeSymptoms = () => {
    // Simple analysis logic (in real app, this would be more sophisticated)
    const symptomCount = selectedSymptoms.length;
    const hasSevereSymptoms = selectedSymptoms.some(id =>
      ['chest_pain', 'short_breath', 'severe_headache'].includes(id)
    );

    let condition = '';
    let urgency = 'low';
    let recommendations = [];

    if (hasSevereSymptoms) {
      condition = 'Potential serious condition';
      urgency = 'high';
      recommendations = [
        'Seek immediate medical attention',
        'Call emergency services if symptoms worsen',
        'Do not delay professional medical evaluation'
      ];
    } else if (symptomCount >= 3) {
      condition = 'Multiple symptoms - possible infection or systemic issue';
      urgency = 'medium';
      recommendations = [
        'Consult a healthcare professional',
        'Monitor symptoms closely',
        'Rest and stay hydrated'
      ];
    } else if (symptomCount > 0) {
      condition = 'Mild symptoms - likely self-limiting';
      urgency = 'low';
      recommendations = [
        'Try natural remedies',
        'Rest and monitor symptoms',
        'Consult doctor if symptoms persist'
      ];
    } else {
      condition = 'No symptoms selected';
      recommendations = ['Please select symptoms to get analysis'];
    }

    setResults({
      condition,
      urgency,
      recommendations,
      selectedSymptoms: selectedSymptoms.map(id =>
        symptoms.find(s => s.id === id)?.name
      ).join(', ')
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
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
          <h1>Symptom Checker</h1>
          <p>Understand your symptoms and get preliminary guidance. Remember, this is not a substitute for professional medical advice.</p>
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
              disabled={selectedSymptoms.length === 0}
            >
              Analyze Symptoms
            </button>
          </div>

          {results && (
            <div className="results-section">
              <h2>Analysis Results</h2>
              <div className={`results-card urgency-${results.urgency}`}>
                <div className="result-header">
                  <h3>{results.condition}</h3>
                  <span className={`urgency-badge ${getUrgencyColor(results.urgency)}`}>
                    {results.urgency.toUpperCase()} URGENCY
                  </span>
                </div>

                <div className="result-details">
                  <p><strong>Selected Symptoms:</strong> {results.selectedSymptoms}</p>
                  <p><strong>Severity:</strong> {severity}</p>
                  <p><strong>Duration:</strong> {duration}</p>
                </div>

                <div className="recommendations">
                  <h4>Recommendations:</h4>
                  <ul>
                    {results.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="disclaimer">
                <h4>⚠️ Important Disclaimer</h4>
                <p>
                  This symptom checker is for informational purposes only and is not a substitute for professional medical advice,
                  diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any
                  questions you may have regarding a medical condition.
                </p>
              </div>

              <div className="next-steps">
                <h3>What to do next?</h3>
                <div className="next-steps-grid">
                  <Link to="/remedies" className="next-step-card">
                    <span className="step-icon">🌿</span>
                    <h4>Natural Remedies</h4>
                    <p>Explore home remedies for your symptoms</p>
                  </Link>
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
