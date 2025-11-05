import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../utils/api';
import '../styles/diet-planner.css';

const DietPlanner = () => {
  const [activeTab, setActiveTab] = useState('assess');
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity: '',
    goal: '',
    dietary: [],
    allergies: []
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ users: 0, plans: 0, satisfaction: 0 });

  // Animation effect for stats
  useEffect(() => {
    const targetStats = { users: 50000, plans: 150000, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        users: Math.floor(targetStats.users * progress),
        plans: Math.floor(targetStats.plans * progress),
        satisfaction: Math.floor(targetStats.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targetStats);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDietary = (restriction) => {
    setUserProfile(prev => ({
      ...prev,
      dietary: prev.dietary.includes(restriction)
        ? prev.dietary.filter(r => r !== restriction)
        : [...prev.dietary, restriction]
    }));
  };

  const toggleAllergy = (allergy) => {
    setUserProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      // Format data as expected by backend
      const dietData = {
        goals: [userProfile.goal].filter(Boolean),
        preferences: userProfile.dietary,
        restrictions: userProfile.allergies,
        currentStats: {
          age: userProfile.age,
          height: userProfile.height,
          weight: userProfile.weight,
          activityLevel: userProfile.activity,
          healthConditions: [] // Add if needed
        }
      };

      const response = await aiAPI.generateAIDietPlan(dietData);
      setGeneratedPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate diet plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diet-planner-page">
      <div className="page-hero">
        <div className="hero-content">
          <h1>Diet Planner</h1>
          <p>Create personalized nutrition plans based on your health goals, lifestyle, and dietary preferences.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{animatedStats.users.toLocaleString()}+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">{animatedStats.plans.toLocaleString()}+</span>
              <span className="stat-label">Plans Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">{animatedStats.satisfaction}%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <span className="floating-icon">🥗</span>
            <span className="floating-icon">🍎</span>
            <span className="floating-icon">🥑</span>
            <span className="floating-icon">🌱</span>
          </div>
        </div>
      </div>

      <div className="planner-tabs">
        <button
          className={`tab-btn ${activeTab === 'assess' ? 'active' : ''}`}
          onClick={() => setActiveTab('assess')}
        >
          <span className="tab-icon">📋</span>
          Assessment
        </button>
        <button
          className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          <span className="tab-icon">📅</span>
          My Plan
        </button>
        <button
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <span className="tab-icon">👨‍🍳</span>
          Recipes
        </button>
      </div>

      <div className="planner-content">
        {activeTab === 'assess' && (
          <div className="assessment-section">
            <h2>Health Assessment</h2>
            <p>Fill in your details to create a personalized diet plan:</p>

            <div className="assessment-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => handleProfileChange('age', e.target.value)}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={userProfile.gender}
                      onChange={(e) => handleProfileChange('gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={userProfile.weight}
                      onChange={(e) => handleProfileChange('weight', e.target.value)}
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={userProfile.height}
                      onChange={(e) => handleProfileChange('height', e.target.value)}
                      placeholder="Enter height in cm"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Lifestyle & Goals</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Activity Level</label>
                    <select
                      value={userProfile.activity}
                      onChange={(e) => handleProfileChange('activity', e.target.value)}
                    >
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary (little exercise)</option>
                      <option value="light">Lightly active (1-3 days/week)</option>
                      <option value="moderate">Moderately active (3-5 days/week)</option>
                      <option value="active">Very active (6-7 days/week)</option>
                      <option value="extra">Extra active (physical job)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Goal</label>
                    <select
                      value={userProfile.goal}
                      onChange={(e) => handleProfileChange('goal', e.target.value)}
                    >
                      <option value="">Select your goal</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="maintenance">Maintain Weight</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="health">General Health</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Dietary Restrictions</h3>
                <div className="options-grid">
                  {['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'paleo', 'mediterranean'].map(restriction => (
                    <label key={restriction} className="option-item">
                      <input
                        type="checkbox"
                        checked={userProfile.dietary.includes(restriction)}
                        onChange={() => toggleDietary(restriction)}
                      />
                      <span className="option-label">
                        {restriction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Allergies</h3>
                <div className="options-grid">
                  {['nuts', 'dairy', 'eggs', 'soy', 'wheat', 'fish', 'shellfish'].map(allergy => (
                    <label key={allergy} className="option-item">
                      <input
                        type="checkbox"
                        checked={userProfile.allergies.includes(allergy)}
                        onChange={() => toggleAllergy(allergy)}
                      />
                      <span className="option-label">
                        {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                {error && <div className="error-message">{error}</div>}
                <button
                  className="generate-btn"
                  onClick={generatePlan}
                  disabled={loading || !userProfile.age || !userProfile.weight || !userProfile.height || !userProfile.goal}
                >
                  {loading ? 'Generating...' : 'Generate My Diet Plan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="plan-section">
            {generatedPlan ? (
              <div className="generated-plan">
                <div className="plan-header">
                  <h2>{generatedPlan.title}</h2>
                  <p>{generatedPlan.description}</p>
                  <div className="plan-stats">
                    <div className="stat">
                      <span className="stat-value">{generatedPlan.dailyCalories}</span>
                      <span className="stat-label">Daily Calories</span>
                    </div>
                    {generatedPlan.bmi && (
                      <div className="stat">
                        <span className="stat-value">{generatedPlan.bmi}</span>
                        <span className="stat-label">BMI</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="plan-details">
                  <div className="meals-section">
                    <h3>Daily Meal Plan</h3>
                    <div className="meals-grid">
                      <div className="meal-card">
                        <h4>🍳 Breakfast</h4>
                        <ul>
                          {generatedPlan.meals.breakfast.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="meal-card">
                        <h4>🥗 Lunch</h4>
                        <ul>
                          {generatedPlan.meals.lunch.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="meal-card">
                        <h4>🍽️ Dinner</h4>
                        <ul>
                          {generatedPlan.meals.dinner.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="meal-card">
                        <h4>🍎 Snacks</h4>
                        <ul>
                          {generatedPlan.meals.snacks.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="tips-section">
                    <h3>Diet Tips</h3>
                    <ul className="tips-list">
                      {generatedPlan.tips.map((tip, index) => (
                        <li key={index}>
                          <span className="tip-icon">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(generatedPlan.restrictions.length > 0 || generatedPlan.allergies.length > 0) && (
                    <div className="restrictions-section">
                      <h3>Considerations</h3>
                      {generatedPlan.restrictions.length > 0 && (
                        <p><strong>Dietary Restrictions:</strong> {generatedPlan.restrictions.join(', ')}</p>
                      )}
                      {generatedPlan.allergies.length > 0 && (
                        <p><strong>Allergies:</strong> {generatedPlan.allergies.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="plan-actions">
                  <button className="save-plan-btn">Save Plan</button>
                  <button className="print-plan-btn">Print Plan</button>
                  <button className="share-plan-btn">Share Plan</button>
                </div>
              </div>
            ) : (
              <div className="no-plan">
                <div className="no-plan-icon">📋</div>
                <h3>No Plan Generated Yet</h3>
                <p>Complete your health assessment to get a personalized diet plan.</p>
                <button
                  className="start-assessment-btn"
                  onClick={() => setActiveTab('assess')}
                >
                  Start Assessment
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="recipes-section">
            <h2>Healthy Recipes</h2>
            <div className="recipes-grid">
              <div className="recipe-card">
                <div className="recipe-image">
                  <span className="recipe-icon">🥗</span>
                </div>
                <div className="recipe-content">
                  <h3>Quinoa Buddha Bowl</h3>
                  <p>Nutrient-packed bowl with quinoa, roasted vegetables, and tahini dressing.</p>
                  <div className="recipe-meta">
                    <span>30 min</span>
                    <span>450 cal</span>
                    <span>Vegan</span>
                  </div>
                </div>
              </div>
              <div className="recipe-card">
                <div className="recipe-image">
                  <span className="recipe-icon">🍗</span>
                </div>
                <div className="recipe-content">
                  <h3>Grilled Chicken Salad</h3>
                  <p>Lean protein with mixed greens, cherry tomatoes, and balsamic vinaigrette.</p>
                  <div className="recipe-meta">
                    <span>20 min</span>
                    <span>320 cal</span>
                    <span>High Protein</span>
                  </div>
                </div>
              </div>
              <div className="recipe-card">
                <div className="recipe-image">
                  <span className="recipe-icon">🥑</span>
                </div>
                <div className="recipe-content">
                  <h3>Avocado Toast Bowl</h3>
                  <p>Whole grain toast topped with smashed avocado, poached eggs, and microgreens.</p>
                  <div className="recipe-meta">
                    <span>15 min</span>
                    <span>380 cal</span>
                    <span>Vegetarian</span>
                  </div>
                </div>
              </div>
              <div className="recipe-card">
                <div className="recipe-image">
                  <span className="recipe-icon">🍎</span>
                </div>
                <div className="recipe-content">
                  <h3>Green Smoothie</h3>
                  <p>Blend of spinach, banana, almond milk, and chia seeds for a nutrient boost.</p>
                  <div className="recipe-meta">
                    <span>5 min</span>
                    <span>180 cal</span>
                    <span>Vegan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="planner-cta">
        <div className="cta-content">
          <h2>Need More Help?</h2>
          <p>Consult with our nutrition experts for personalized guidance and meal planning support.</p>
          <div className="cta-buttons">
            <Link to="/appointment" className="cta-primary">Book Consultation</Link>
            <Link to="/remedies" className="cta-secondary">Natural Supplements</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;
