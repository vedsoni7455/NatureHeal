import React, { useState } from 'react';
import '../styles/therapies.css';

const Therapies = () => {
  const [activeTab, setActiveTab] = useState('acupressure');

  const therapies = {
    acupressure: {
      title: 'Acupressure Therapy',
      icon: '💆‍♀️',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop&crop=center',
      description: 'Ancient Chinese healing technique using finger pressure on specific points to promote healing and relieve pain.',
      benefits: [
        'Relieves muscle tension and pain',
        'Improves circulation',
        'Reduces stress and anxiety',
        'Boosts immune system',
        'Promotes better sleep',
        'Helps with digestive issues'
      ],
      techniques: [
        {
          name: 'LI4 Point (Hegu)',
          location: 'Between thumb and index finger',
          benefits: 'Headaches, toothaches, facial pain',
          instructions: 'Apply firm pressure with thumb for 1-2 minutes'
        },
        {
          name: 'LV3 Point (Taichong)',
          location: 'Top of foot between big toe and second toe',
          benefits: 'Stress relief, menstrual cramps, eye strain',
          instructions: 'Press firmly with thumb while breathing deeply'
        },
        {
          name: 'PC6 Point (Neiguan)',
          location: 'Inner forearm, 3 finger widths from wrist',
          benefits: 'Nausea, motion sickness, anxiety',
          instructions: 'Apply pressure in circular motions for 2-3 minutes'
        }
      ],
      precautions: [
        'Avoid during pregnancy (certain points)',
        'Consult healthcare provider if pregnant',
        'Stop if you feel sharp pain',
        'Not a substitute for medical treatment'
      ]
    },
    acupuncture: {
      title: 'Acupuncture Therapy',
      icon: '🪡',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center',
      description: 'Traditional Chinese medicine using thin needles to balance energy flow and promote healing through meridian points.',
      benefits: [
        'Pain relief and management',
        'Reduces inflammation',
        'Improves sleep quality',
        'Reduces stress and anxiety',
        'Enhances immune function',
        'Supports mental health'
      ],
      techniques: [
        {
          name: 'Body Acupuncture',
          description: 'Traditional needle insertion at meridian points',
          conditions: 'Chronic pain, digestive issues, stress'
        },
        {
          name: 'Auricular Acupuncture',
          description: 'Needles placed in ear points',
          conditions: 'Addiction, anxiety, weight management'
        },
        {
          name: 'Electro-Acupuncture',
          description: 'Electrical stimulation through needles',
          conditions: 'Chronic pain, neurological conditions'
        }
      ],
      precautions: [
        'Performed by licensed practitioners only',
        'Inform practitioner of medications',
        'May cause mild bruising',
        'Not recommended for certain bleeding disorders'
      ]
    },
    massage: {
      title: 'Massage Therapy',
      icon: '💆',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop&crop=center',
      description: 'Manual manipulation of soft tissues to enhance physical and mental well-being through various massage techniques.',
      benefits: [
        'Reduces muscle tension and pain',
        'Improves blood circulation',
        'Reduces stress and anxiety',
        'Enhances flexibility and range of motion',
        'Promotes better sleep',
        'Boosts immune system'
      ],
      techniques: [
        {
          name: 'Swedish Massage',
          description: 'Gentle, relaxing strokes to improve circulation',
          conditions: 'Stress relief, muscle tension, relaxation'
        },
        {
          name: 'Deep Tissue Massage',
          description: 'Firm pressure targeting deeper muscle layers',
          conditions: 'Chronic pain, muscle knots, injury recovery'
        },
        {
          name: 'Sports Massage',
          description: 'Techniques for athletes and active individuals',
          conditions: 'Performance enhancement, injury prevention'
        }
      ],
      precautions: [
        'Avoid if you have certain medical conditions',
        'Inform therapist of any injuries or conditions',
        'May cause temporary soreness',
        'Not recommended immediately after injury'
      ]
    },
    mud: {
      title: 'Mud Therapy',
      icon: '🌿',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center',
      description: 'Natural healing using therapeutic mud packs to detoxify, reduce inflammation, and promote skin health.',
      benefits: [
        'Detoxifies the body',
        'Reduces inflammation and swelling',
        'Improves skin health and complexion',
        'Relieves joint and muscle pain',
        'Enhances circulation',
        'Promotes relaxation'
      ],
      techniques: [
        {
          name: 'Full Body Mud Pack',
          description: 'Mud applied to entire body for detoxification',
          conditions: 'Skin conditions, detoxification, relaxation'
        },
        {
          name: 'Localized Mud Therapy',
          description: 'Mud packs applied to specific areas',
          conditions: 'Joint pain, inflammation, skin issues'
        },
        {
          name: 'Mud Bath',
          description: 'Immersion in mud for therapeutic benefits',
          conditions: 'Arthritis, skin disorders, stress relief'
        }
      ],
      precautions: [
        'Avoid if allergic to mud components',
        'Consult doctor if pregnant or have medical conditions',
        'Clean skin thoroughly after treatment',
        'May cause temporary skin irritation'
      ]
    },
    color: {
      title: 'Color Therapy',
      icon: '🌈',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop&crop=center',
      description: 'Chromotherapy using colors to balance energy, promote healing, and improve emotional well-being.',
      benefits: [
        'Balances energy and chakras',
        'Improves mood and emotional health',
        'Reduces stress and anxiety',
        'Enhances concentration and focus',
        'Promotes physical healing',
        'Supports sleep quality'
      ],
      techniques: [
        {
          name: 'Red Light Therapy',
          description: 'Energizing red light for vitality and circulation',
          conditions: 'Fatigue, poor circulation, low energy'
        },
        {
          name: 'Blue Light Therapy',
          description: 'Calming blue light for peace and communication',
          conditions: 'Anxiety, insomnia, throat issues'
        },
        {
          name: 'Green Light Therapy',
          description: 'Balancing green light for harmony and growth',
          conditions: 'Stress, heart issues, immune support'
        }
      ],
      precautions: [
        'Not a substitute for medical treatment',
        'Consult healthcare provider for serious conditions',
        'May affect photosensitive individuals',
        'Use appropriate exposure times'
      ]
    },
    pyramid: {
      title: 'Pyramid Therapy',
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      description: 'Energy healing using pyramid structures to harness cosmic energy for meditation, healing, and spiritual growth.',
      benefits: [
        'Enhances meditation and spiritual awareness',
        'Promotes physical healing and regeneration',
        'Reduces stress and promotes relaxation',
        'Improves sleep quality',
        'Balances energy fields',
        'Supports emotional healing'
      ],
      techniques: [
        {
          name: 'Pyramid Meditation',
          description: 'Meditating inside or under pyramid structures',
          conditions: 'Stress relief, spiritual growth, mental clarity'
        },
        {
          name: 'Pyramid Energy Healing',
          description: 'Using pyramid energy for therapeutic purposes',
          conditions: 'Pain relief, healing acceleration, energy balancing'
        },
        {
          name: 'Pyramid Water Charging',
          description: 'Charging water with pyramid energy',
          conditions: 'Enhanced hydration, detoxification, healing'
        }
      ],
      precautions: [
        'Practice in safe, stable pyramid structures',
        'Start with short sessions',
        'May cause intense energy sensations',
        'Not recommended for certain mental health conditions'
      ]
    }

  };

  return (
    <div className="therapies-page">
      <div className="therapies-hero">
        <div className="container">
          <h1>Alternative Therapies</h1>
          <p>Discover the healing power of traditional therapies including acupressure, acupuncture, massage, mud therapy, color therapy, and pyramid therapy</p>
        </div>
      </div>

      <div className="container">
        {/* Tab Navigation */}
        <div className="therapy-tabs">
          <button
            className={`tab-btn ${activeTab === 'acupressure' ? 'active' : ''}`}
            onClick={() => setActiveTab('acupressure')}
          >
            <span className="tab-icon">💆‍♀️</span>
            Acupressure
          </button>
          <button
            className={`tab-btn ${activeTab === 'acupuncture' ? 'active' : ''}`}
            onClick={() => setActiveTab('acupuncture')}
          >
            <span className="tab-icon">🪡</span>
            Acupuncture
          </button>
          <button
            className={`tab-btn ${activeTab === 'massage' ? 'active' : ''}`}
            onClick={() => setActiveTab('massage')}
          >
            <span className="tab-icon">💆</span>
            Massage Therapy
          </button>
          <button
            className={`tab-btn ${activeTab === 'mud' ? 'active' : ''}`}
            onClick={() => setActiveTab('mud')}
          >
            <span className="tab-icon">🌿</span>
            Mud Therapy
          </button>
          <button
            className={`tab-btn ${activeTab === 'color' ? 'active' : ''}`}
            onClick={() => setActiveTab('color')}
          >
            <span className="tab-icon">🌈</span>
            Color Therapy
          </button>
          <button
            className={`tab-btn ${activeTab === 'pyramid' ? 'active' : ''}`}
            onClick={() => setActiveTab('pyramid')}
          >
            <span className="tab-icon">🏛️</span>
            Pyramid Therapy
          </button>
        </div>

        {/* Therapy Content */}
        <div className="therapy-content">
          {Object.entries(therapies).map(([key, therapy]) => (
            <div key={key} className={`therapy-section ${activeTab === key ? 'active' : ''}`}>
              <div className="therapy-header">
                <div className="therapy-image">
                  <img src={therapy.image} alt={therapy.title} />
                </div>
                <div className="therapy-content-wrapper">
                  <div className="therapy-icon">
                    <span>{therapy.icon}</span>
                  </div>
                  <div className="therapy-intro">
                    <h2>{therapy.title}</h2>
                    <p>{therapy.description}</p>
                  </div>
                </div>
              </div>

              <div className="therapy-grid">
                {/* Benefits */}
                <div className="therapy-card benefits-card">
                  <h3>Benefits</h3>
                  <ul className="benefits-list">
                    {therapy.benefits.map((benefit, index) => (
                      <li key={index}>
                        <span className="benefit-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Techniques/Methods */}
                <div className="therapy-card techniques-card">
                  <h3>{key === 'acupressure' ? 'Key Pressure Points' : 'Techniques'}</h3>
                  <div className="techniques-list">
                    {therapy.techniques.map((technique, index) => (
                      <div key={index} className="technique-item">
                        <h4>{technique.name}</h4>
                        {technique.location && (
                          <p className="technique-location">
                            <strong>Location:</strong> {technique.location}
                          </p>
                        )}
                        {technique.description && (
                          <p className="technique-description">{technique.description}</p>
                        )}
                        {technique.conditions && (
                          <p className="technique-conditions">
                            <strong>Conditions:</strong> {technique.conditions}
                          </p>
                        )}
                        {technique.instructions && (
                          <p className="technique-instructions">
                            <strong>Instructions:</strong> {technique.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="therapy-card precautions-card">
                  <h3>Important Precautions</h3>
                  <ul className="precautions-list">
                    {therapy.precautions.map((precaution, index) => (
                      <li key={index}>
                        <span className="precaution-icon">⚠️</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className="therapy-cta">
                <div className="cta-content">
                  <h3>Begin Your Therapy Journey</h3>
                  <p>Experience the healing benefits of {therapy.title.toLowerCase()} with our certified practitioners.</p>
                  <div className="cta-buttons">
                    <button className="cta-primary">Book Session</button>
                    <button className="cta-secondary">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="therapy-cta">
          <div className="cta-content">
            <h3>Ready to Experience Natural Healing?</h3>
            <p>Consult with our certified practitioners to learn more about these therapies and how they can benefit your health journey.</p>
            <div className="cta-buttons">
              <button className="cta-primary">Book Consultation</button>
              <button className="cta-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Therapies;
