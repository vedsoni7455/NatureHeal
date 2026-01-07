import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/ai-health-hub.css';

const WellnessHub = () => {
    const [query, setQuery] = useState('');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGeneratePlan = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/ai/unified-plan', { query });
            setPlan(res.data);
        } catch (err) {
            console.error('Error generating plan:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to generate your health plan.';
            const details = err.response?.data?.details || '';
            setError(details ? `${errorMsg} (${details})` : errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-health-hub">
            <section className="hub-hero">
                <h1>AI Health Wellness Hub</h1>
                <p>Get a personalized, holistic health plan combining natural remedies, yoga, diet, and lifestyle changes in seconds.</p>

                <div className="query-container">
                    <input
                        type="text"
                        className="query-input"
                        placeholder="Describe your concern (e.g., 'Insomnia and stress' or 'Joint pain')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGeneratePlan()}
                    />
                    <button
                        className="generate-btn"
                        onClick={handleGeneratePlan}
                        disabled={loading || query.length < 3}
                    >
                        {loading ? 'Consulting AI...' : 'Generate Plan'}
                    </button>
                </div>
            </section>

            {loading && (
                <div className="loading-state">
                    <div className="ai-loader"></div>
                    <h2>Our AI is analyzing your profile...</h2>
                    <p>Integrating remedies, yoga, and dietary science for your personalized plan.</p>
                </div>
            )}

            {error && (
                <div className="error-message" style={{ textAlign: 'center', color: 'red', margin: '2rem 0' }}>
                    <h3>Oops! {error}</h3>
                    <button onClick={handleGeneratePlan} className="generate-btn" style={{ margin: '1rem auto' }}>Retry</button>
                </div>
            )}

            {plan && !loading && (
                <div className="plan-container">
                    <aside className="plan-sidebar">
                        <div className="analysis-card">
                            <h2><span>🔍</span> AI Analysis</h2>
                            <p>{plan.analysis}</p>
                        </div>

                        <div className="lifestyle-card">
                            <h3>Lifestyle Habits</h3>
                            <ul className="lifestyle-list">
                                {plan.lifestyle?.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Diet Section Moved Here */}
                        <div className="diet-sidebar-card">
                            <h3>Holistic Diet</h3>
                            <div className="diet-grid-sidebar">
                                {plan.diet?.map((item, idx) => (
                                    <div key={idx} className="diet-item-mini">
                                        <div className="diet-icon-mini">🍏</div>
                                        <div className="diet-info">
                                            <h4>{item.food}</h4>
                                            <p>{item.advice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="plan-main">
                        {/* Remedies Section */}
                        <section className="plan-section">
                            <div className="section-title">
                                <h2><div className="section-icon">🌿</div> Natural Remedies</h2>
                            </div>
                            <div className="grid-cards">
                                {plan.remedies?.map((remedy, idx) => (
                                    <div key={idx} className="hub-card">
                                        <h4>{remedy.name}</h4>
                                        <p><strong>Ingredients:</strong> {remedy.ingredients}</p>
                                        <div className="card-feature">
                                            <strong>Instructions:</strong>
                                            <p>{remedy.instructions}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Yoga Section */}
                        <section className="plan-section">
                            <div className="section-title">
                                <h2><div className="section-icon">🧘</div> Yoga & Breathing</h2>
                            </div>
                            <div className="grid-cards">
                                {plan.yoga?.poses?.map((pose, idx) => (
                                    <div key={idx} className="hub-card">
                                        <h4>{pose.name}</h4>
                                        <p>{pose.benefits}</p>
                                        <div className="card-feature">
                                            <strong>Technique:</strong>
                                            <p>{pose.instructions || pose.technique || 'Detailed steps coming soon...'}</p>
                                        </div>
                                        <div className="card-feature">
                                            <strong>Duration:</strong> {pose.duration}
                                        </div>
                                    </div>
                                ))}
                                {plan.yoga?.breathing && (
                                    <div className="hub-card" style={{ borderLeft: '4px solid var(--secondary-50)' }}>
                                        <h4>Pranayama: {plan.yoga.breathing.name}</h4>
                                        <div className="card-feature">
                                            <strong>Technique:</strong>
                                            <p>{plan.yoga.breathing.instructions}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>


                        {/* mudras Section */}
                        <section className="plan-section">
                            <div className="section-title">
                                <h2><div className="section-icon">🙏</div> Healing Mudras</h2>
                            </div>
                            <div className="grid-cards">
                                {plan.mudras?.map((mudra, idx) => (
                                    <div key={idx} className="hub-card">
                                        <h4>{mudra.name}</h4>
                                        <p>{mudra.benefits}</p>
                                        <div className="card-feature">
                                            <strong>Technique:</strong>
                                            <p>{mudra.instructions || mudra.technique || 'Detailed steps coming soon...'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            )}

            {!plan && !loading && (
                <div style={{ textAlign: 'center', margin: '4rem 0', opacity: 0.6 }}>
                    <img src="/images/wellness-placeholder.png" alt="Health" style={{ width: '250px', marginBottom: '1.5rem', borderRadius: '2rem' }} />
                    <h2>Ready when you are...</h2>
                    <p>Type your symptoms or health goals above to get started.</p>
                </div>
            )}
        </div>
    );
};

export default WellnessHub;
