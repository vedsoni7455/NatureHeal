import React, { useState } from 'react';
import '../styles/mudras.css';

const Mudras = () => {
  const [activeTab, setActiveTab] = useState('gyan');

  const mudras = {
    gyan: {
      title: 'Gyan Mudra (Mudra of Knowledge)',
      icon: '🧘',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center',
      description: 'A powerful mudra that enhances concentration, memory, and wisdom. Formed by touching the tip of the index finger to the tip of the thumb.',
      benefits: [
        'Improves concentration and memory',
        'Reduces stress and anxiety',
        'Enhances learning abilities',
        'Promotes mental clarity',
        'Balances the air element in the body',
        'Supports spiritual awakening'
      ],
      howTo: [
        'Sit comfortably in a meditative pose',
        'Place hands on knees with palms facing up',
        'Touch the tip of the index finger to the tip of the thumb',
        'Keep other fingers straight and relaxed',
        'Practice for 15-30 minutes daily',
        'Breathe deeply and focus on the third eye'
      ],
      precautions: [
        'Practice on an empty stomach for best results',
        'Avoid if you have high blood pressure',
        'Consult a yoga instructor if new to mudras',
        'Stop if you feel discomfort in fingers'
      ]
    },
    prana: {
      title: 'Prana Mudra (Mudra of Life)',
      icon: '💫',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center',
      description: 'Also known as the Mudra of Life, this gesture activates the root chakra and increases vitality and energy.',
      benefits: [
        'Increases vitality and energy levels',
        'Improves immune system function',
        'Enhances vision and reduces eye strain',
        'Balances all five elements in the body',
        'Reduces fatigue and lethargy',
        'Promotes overall physical health'
      ],
      howTo: [
        'Sit in a comfortable meditative posture',
        'Place hands on thighs with palms up',
        'Bend the ring finger and little finger to touch the thumb tip',
        'Keep index and middle fingers extended',
        'Practice for 15-30 minutes',
        'Focus on the flow of prana (life force)'
      ],
      precautions: [
        'Not recommended during pregnancy',
        'Avoid if suffering from fever',
        'Practice in a calm environment',
        'Stop immediately if feeling dizzy'
      ]
    },
    vayu: {
      title: 'Vayu Mudra (Mudra of Air)',
      icon: '🌬️',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop&crop=center',
      description: 'This mudra helps balance the air element in the body, relieving issues related to excess wind or gas.',
      benefits: [
        'Relieves joint pain and arthritis',
        'Reduces flatulence and bloating',
        'Helps with paralysis and facial palsy',
        'Balances the air element (vayu)',
        'Improves respiratory health',
        'Reduces anxiety and nervousness'
      ],
      howTo: [
        'Sit comfortably with spine straight',
        'Place hands on knees',
        'Fold the index finger to touch the base of the thumb',
        'Press the thumb over the folded index finger',
        'Extend other fingers straight',
        'Practice for 10-15 minutes on each hand'
      ],
      precautions: [
        'Avoid during pregnancy',
        'Not suitable for those with high pitta',
        'Practice under guidance if new to mudras',
        'Stop if experiencing increased discomfort'
      ]
    },
    surya: {
      title: 'Surya Mudra (Mudra of Sun)',
      icon: '☀️',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop&crop=center',
      description: 'Activates the fire element in the body, helping with weight loss, digestion, and thyroid function.',
      benefits: [
        'Aids in weight loss and metabolism',
        'Improves digestion and reduces cholesterol',
        'Balances thyroid function',
        'Reduces anxiety and depression',
        'Increases body heat and energy',
        'Improves calcium absorption'
      ],
      howTo: [
        'Sit in any comfortable posture',
        'Place hands on thighs',
        'Bend the ring finger to touch the thumb tip',
        'Apply gentle pressure with the thumb',
        'Keep other fingers extended',
        'Practice for 15 minutes daily'
      ],
      precautions: [
        'Avoid if suffering from fever or inflammation',
        'Not recommended for those with high pitta dosha',
        'Practice in moderation',
        'Consult doctor if having thyroid issues'
      ]
    },
    varun: {
      title: 'Varun Mudra (Mudra of Water)',
      icon: '💧',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center',
      description: 'Balances the water element in the body, helping with dehydration, skin issues, and fluid retention.',
      benefits: [
        'Balances body fluids and hydration',
        'Improves skin health and complexion',
        'Reduces dryness in body and skin',
        'Helps with urinary problems',
        'Reduces swelling and edema',
        'Promotes healthy digestion'
      ],
      howTo: [
        'Sit comfortably in meditation pose',
        'Place hands on knees with palms up',
        'Touch the tip of the little finger to the thumb tip',
        'Keep other fingers straight',
        'Practice for 15-20 minutes',
        'Focus on the water element in the body'
      ],
      precautions: [
        'Avoid if you have excessive mucus or cold',
        'Not recommended for kapha-dominant individuals',
        'Practice in a balanced manner',
        'Stop if feeling excessive thirst'
      ]
    },
    apana: {
      title: 'Apana Mudra (Mudra of Digestion)',
      icon: '🔥',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      description: 'Stimulates the downward flow of energy, aiding digestion, elimination, and reproductive health.',
      benefits: [
        'Improves digestion and eliminates toxins',
        'Regulates menstrual cycles',
        'Aids in childbirth and postpartum recovery',
        'Relieves constipation and piles',
        'Strengthens pelvic floor muscles',
        'Promotes healthy elimination'
      ],
      howTo: [
        'Sit in a comfortable position',
        'Place hands on thighs',
        'Join the tips of middle and ring fingers with the thumb',
        'Keep index and little fingers extended',
        'Practice for 15-20 minutes',
        'Focus on the lower abdomen'
      ],
      precautions: [
        'Avoid during pregnancy (except under guidance)',
        'Not recommended immediately after meals',
        'Practice gently if having digestive issues',
        'Consult practitioner for reproductive concerns'
      ]
    }
  };

  return (
    <div className="mudras-page">
      <div className="mudras-hero">
        <div className="container">
          <h1>Yoga Mudras</h1>
          <p>Discover the ancient art of hand gestures that channel energy and promote healing</p>
        </div>
      </div>

      <div className="container">
        {/* Tab Navigation */}
        <div className="mudra-tabs">
          <button
            className={`tab-btn ${activeTab === 'gyan' ? 'active' : ''}`}
            onClick={() => setActiveTab('gyan')}
          >
            <span className="tab-icon">🧘</span>
            Gyan Mudra
          </button>
          <button
            className={`tab-btn ${activeTab === 'prana' ? 'active' : ''}`}
            onClick={() => setActiveTab('prana')}
          >
            <span className="tab-icon">💫</span>
            Prana Mudra
          </button>
          <button
            className={`tab-btn ${activeTab === 'vayu' ? 'active' : ''}`}
            onClick={() => setActiveTab('vayu')}
          >
            <span className="tab-icon">🌬️</span>
            Vayu Mudra
          </button>
          <button
            className={`tab-btn ${activeTab === 'surya' ? 'active' : ''}`}
            onClick={() => setActiveTab('surya')}
          >
            <span className="tab-icon">☀️</span>
            Surya Mudra
          </button>
          <button
            className={`tab-btn ${activeTab === 'varun' ? 'active' : ''}`}
            onClick={() => setActiveTab('varun')}
          >
            <span className="tab-icon">💧</span>
            Varun Mudra
          </button>
          <button
            className={`tab-btn ${activeTab === 'apana' ? 'active' : ''}`}
            onClick={() => setActiveTab('apana')}
          >
            <span className="tab-icon">🔥</span>
            Apana Mudra
          </button>
        </div>

        {/* Mudra Content */}
        <div className="mudra-content">
          {Object.entries(mudras).map(([key, mudra]) => (
            <div key={key} className={`mudra-section ${activeTab === key ? 'active' : ''}`}>
              <div className="mudra-header">
                <div className="mudra-image">
                  <img src={mudra.image} alt={mudra.title} />
                </div>
                <div className="mudra-content-wrapper">
                  <div className="mudra-icon">
                    <span>{mudra.icon}</span>
                  </div>
                  <div className="mudra-intro">
                    <h2>{mudra.title}</h2>
                    <p>{mudra.description}</p>
                  </div>
                </div>
              </div>

              <div className="mudra-grid">
                {/* Benefits */}
                <div className="mudra-card benefits-card">
                  <h3>Benefits</h3>
                  <ul className="benefits-list">
                    {mudra.benefits.map((benefit, index) => (
                      <li key={index}>
                        <span className="benefit-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How to Practice */}
                <div className="mudra-card howto-card">
                  <h3>How to Practice</h3>
                  <ol className="howto-list">
                    {mudra.howTo.map((step, index) => (
                      <li key={index}>
                        <span className="step-number">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Precautions */}
                <div className="mudra-card precautions-card">
                  <h3>Important Precautions</h3>
                  <ul className="precautions-list">
                    {mudra.precautions.map((precaution, index) => (
                      <li key={index}>
                        <span className="precaution-icon">⚠️</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mudra-cta">
                <div className="cta-content">
                  <h3>Begin Your Mudra Practice</h3>
                  <p>Join our yoga classes to learn proper mudra techniques and experience their transformative power.</p>
                  <div className="cta-buttons">
                    <button className="cta-primary">Book Yoga Class</button>
                    <button className="cta-secondary">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mudras;
