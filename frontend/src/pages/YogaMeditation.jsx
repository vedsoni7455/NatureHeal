import React, { useState } from 'react';

const YogaMeditation = () => {
  const [activeTab, setActiveTab] = useState('yoga');

  const breathingExercises = [
    {
      name: 'Deep Breathing (Pranayama)',
      description: 'Sit comfortably and take slow, deep breaths through your nose.',
      instructions: 'Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5-10 times.',
      icon: '🌬️',
      duration: '5-10 min',
      benefits: 'Reduces stress, improves lung capacity'
    },
    {
      name: '4-7-8 Breathing',
      description: 'A calming technique that promotes relaxation and better sleep.',
      instructions: 'Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.',
      icon: '🫁',
      duration: '2-4 min',
      benefits: 'Calms nervous system, aids sleep'
    },
    {
      name: 'Box Breathing',
      description: 'Military technique for focus and stress reduction.',
      instructions: 'Inhale 4, hold 4, exhale 4, hold 4. Repeat in square pattern.',
      icon: '⬜',
      duration: '5 min',
      benefits: 'Enhances concentration, reduces anxiety'
    },
    {
      name: 'Alternate Nostril Breathing',
      description: 'Balances energy flow between brain hemispheres.',
      instructions: 'Close right nostril, inhale left; close left, exhale right. Alternate.',
      icon: '👃',
      duration: '5-10 min',
      benefits: 'Balances mind, improves focus'
    },
    {
      name: 'Lion\'s Breath',
      description: 'Exhales forcefully while making a "ha" sound.',
      instructions: 'Inhale deeply, then exhale forcefully with tongue out. Repeat 3-5 times.',
      icon: '🦁',
      duration: '2-3 min',
      benefits: 'Releases tension, energizes'
    },
    {
      name: 'Pursued Lip Breathing',
      description: 'Controls breath for better lung function.',
      instructions: 'Inhale through nose, exhale slowly through pursed lips. Repeat.',
      icon: '👄',
      duration: '5-10 min',
      benefits: 'Improves breathing efficiency, reduces shortness of breath'
    }
  ];

  const relaxationTherapies = [
    {
      name: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax muscle groups.',
      instructions: 'Tense muscles for 5 seconds, then release. Work from toes to head.',
      icon: '💪',
      duration: '10-15 min',
      benefits: 'Reduces physical tension, promotes deep relaxation'
    },
    {
      name: 'Autogenic Training',
      description: 'Use self-suggestions to induce relaxation.',
      instructions: 'Repeat phrases like "My arms are heavy and warm" while relaxing.',
      icon: '🧠',
      duration: '10-20 min',
      benefits: 'Self-induced relaxation, stress reduction'
    },
    {
      name: 'Guided Imagery',
      description: 'Visualize peaceful scenes to calm the mind.',
      instructions: 'Close eyes and imagine a serene beach or forest. Focus on details.',
      icon: '🌊',
      duration: '10-15 min',
      benefits: 'Mental relaxation, reduces anxiety'
    },
    {
      name: 'Biofeedback Training',
      description: 'Learn to control physiological functions.',
      instructions: 'Use monitors to observe and control heart rate, muscle tension.',
      icon: '📊',
      duration: '15-30 min',
      benefits: 'Control over body responses, pain management'
    },
    {
      name: 'Aromatherapy Massage',
      description: 'Use essential oils with gentle massage.',
      instructions: 'Apply diluted essential oils (lavender, chamomile) with circular motions.',
      icon: '🕯️',
      duration: '20-30 min',
      benefits: 'Physical and emotional relaxation, improved circulation'
    },
    {
      name: 'Sound Therapy',
      description: 'Use soothing sounds to promote relaxation.',
      instructions: 'Listen to nature sounds, Tibetan bowls, or binaural beats.',
      icon: '🎵',
      duration: '15-30 min',
      benefits: 'Mental calmness, improved sleep quality'
    }
  ];

  const yogaPoses = [
    {
      name: 'Mountain Pose (Tadasana)',
      description: 'Stand tall with feet together, arms at sides. Improves posture and balance.',
      benefits: 'Strengthens legs, improves posture, reduces stress.',
      icon: '🏔️',
      difficulty: 'Beginner',
      duration: '1-2 min'
    },
    {
      name: 'Tree Pose (Vrksasana)',
      description: 'Stand on one leg, place other foot on inner thigh, hands in prayer position.',
      benefits: 'Improves balance, strengthens legs, enhances focus.',
      icon: '🌳',
      difficulty: 'Intermediate',
      duration: '30-60 sec'
    },
    {
      name: 'Child\'s Pose (Balasana)',
      description: 'Kneel and fold forward, arms extended, forehead on ground.',
      benefits: 'Relieves stress, stretches back, promotes relaxation.',
      icon: '🧘',
      difficulty: 'Beginner',
      duration: '1-3 min'
    },
    {
      name: 'Warrior Pose (Virabhadrasana)',
      description: 'Step one foot back, bend front knee, extend arms overhead.',
      benefits: 'Builds strength, improves stamina, boosts confidence.',
      icon: '⚔️',
      difficulty: 'Intermediate',
      duration: '30-60 sec'
    },
    {
      name: 'Downward Dog (Adho Mukha Svanasana)',
      description: 'Form an inverted V-shape with hands and feet on ground.',
      benefits: 'Stretches entire body, strengthens arms and legs.',
      icon: '🐕',
      difficulty: 'Beginner',
      duration: '1-2 min'
    },
    {
      name: 'Lotus Pose (Padmasana)',
      description: 'Sit cross-legged with feet on opposite thighs.',
      benefits: 'Improves flexibility, aids meditation, calms mind.',
      icon: '🪷',
      difficulty: 'Advanced',
      duration: '5-10 min'
    }
  ];

  const meditationTechniques = [
    {
      name: 'Mindful Breathing',
      description: 'Focus on your breath, inhaling and exhaling slowly.',
      instructions: 'Sit comfortably, close eyes, count breaths from 1 to 10.',
      icon: '🌬️',
      duration: '5-10 min',
      benefits: 'Reduces anxiety, improves focus'
    },
    {
      name: 'Body Scan',
      description: 'Mentally scan your body from toes to head, releasing tension.',
      instructions: 'Lie down, focus on each body part, relax as you go.',
      icon: '🔍',
      duration: '10-15 min',
      benefits: 'Releases physical tension, promotes sleep'
    },
    {
      name: 'Loving-Kindness Meditation',
      description: 'Send love and compassion to yourself and others.',
      instructions: 'Repeat phrases like "May I be happy, may I be healthy."',
      icon: '❤️',
      duration: '10-20 min',
      benefits: 'Increases compassion, reduces negative emotions'
    },
    {
      name: 'Transcendental Meditation',
      description: 'Silently repeat a mantra to settle the mind.',
      instructions: 'Sit comfortably, repeat your mantra silently.',
      icon: '🧘‍♀️',
      duration: '15-20 min',
      benefits: 'Reduces stress, improves creativity'
    },
    {
      name: 'Guided Visualization',
      description: 'Follow along with peaceful imagery and scenarios.',
      instructions: 'Listen to a guide or imagine serene places.',
      icon: '🌅',
      duration: '10-15 min',
      benefits: 'Enhances relaxation, boosts mood'
    },
    {
      name: 'Walking Meditation',
      description: 'Practice mindfulness while walking slowly.',
      instructions: 'Walk slowly, focus on each step and breath.',
      icon: '🚶',
      duration: '10-20 min',
      benefits: 'Combines movement with mindfulness'
    }
  ];

  return (
    <div className="yoga-meditation-page">
      {/* Hero Section */}
      <div className="page-hero">
        <div className="hero-content">
          <h1>Yoga & Meditation</h1>
          <p>Discover ancient practices for modern wellness. Enhance your physical and mental well-being through yoga asanas and meditation techniques.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Yoga Poses</span>
            </div>
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Meditation Techniques</span>
            </div>
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Breathing Exercises</span>
            </div>
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Relaxation Therapies</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Benefits</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <span className="floating-icon">🧘</span>
            <span className="floating-icon">🌸</span>
            <span className="floating-icon">☯️</span>
            <span className="floating-icon">🌿</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="content-tabs">
        <button
          className={`tab-btn ${activeTab === 'yoga' ? 'active' : ''}`}
          onClick={() => setActiveTab('yoga')}
        >
          <span className="tab-icon">🧘</span>
          Yoga Asanas
        </button>
        <button
          className={`tab-btn ${activeTab === 'meditation' ? 'active' : ''}`}
          onClick={() => setActiveTab('meditation')}
        >
          <span className="tab-icon">🧠</span>
          Meditation
        </button>
        <button
          className={`tab-btn ${activeTab === 'breathing' ? 'active' : ''}`}
          onClick={() => setActiveTab('breathing')}
        >
          <span className="tab-icon">🫁</span>
          Breathing Exercises
        </button>
        <button
          className={`tab-btn ${activeTab === 'relaxation' ? 'active' : ''}`}
          onClick={() => setActiveTab('relaxation')}
        >
          <span className="tab-icon">😌</span>
          Relaxation Therapies
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === 'yoga' && (
        <section className="content-section">
          <div className="section-header">
            <h2>Yoga Asanas</h2>
            <p>Practice these foundational yoga poses to build strength, flexibility, and inner peace.</p>
          </div>
          <div className="poses-grid">
            {yogaPoses.map((pose, index) => (
              <div key={index} className="practice-card">
                <div className="card-header">
                  <div className="card-icon">{pose.icon}</div>
                  <div className="card-meta">
                    <span className={`difficulty ${pose.difficulty.toLowerCase()}`}>
                      {pose.difficulty}
                    </span>
                    <span className="duration">{pose.duration}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{pose.name}</h3>
                  <p className="description">{pose.description}</p>
                  <div className="benefits">
                    <h4>Benefits:</h4>
                    <p>{pose.benefits}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="practice-btn">
                    <span>▶️</span> Practice Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'meditation' && (
        <section className="content-section">
          <div className="section-header">
            <h2>Meditation Techniques</h2>
            <p>Explore various meditation practices to cultivate mindfulness and mental clarity.</p>
          </div>
          <div className="techniques-grid">
            {meditationTechniques.map((technique, index) => (
              <div key={index} className="practice-card">
                <div className="card-header">
                  <div className="card-icon">{technique.icon}</div>
                  <div className="card-meta">
                    <span className="duration">{technique.duration}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{technique.name}</h3>
                  <p className="description">{technique.description}</p>
                  <div className="instructions">
                    <h4>How to Practice:</h4>
                    <p>{technique.instructions}</p>
                  </div>
                  <div className="benefits">
                    <h4>Benefits:</h4>
                    <p>{technique.benefits}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="practice-btn">
                    <span>🔔</span> Start Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'breathing' && (
        <section className="content-section">
          <div className="section-header">
            <h2>Breathing Exercises</h2>
            <p>Master the art of conscious breathing to enhance your physical and mental well-being.</p>
          </div>
          <div className="techniques-grid">
            {breathingExercises.map((exercise, index) => (
              <div key={index} className="practice-card">
                <div className="card-header">
                  <div className="card-icon">{exercise.icon}</div>
                  <div className="card-meta">
                    <span className="duration">{exercise.duration}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{exercise.name}</h3>
                  <p className="description">{exercise.description}</p>
                  <div className="instructions">
                    <h4>How to Practice:</h4>
                    <p>{exercise.instructions}</p>
                  </div>
                  <div className="benefits">
                    <h4>Benefits:</h4>
                    <p>{exercise.benefits}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="practice-btn">
                    <span>🌬️</span> Start Breathing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'relaxation' && (
        <section className="content-section">
          <div className="section-header">
            <h2>Relaxation Therapies</h2>
            <p>Discover powerful techniques to release tension and achieve deep relaxation.</p>
          </div>
          <div className="techniques-grid">
            {relaxationTherapies.map((therapy, index) => (
              <div key={index} className="practice-card">
                <div className="card-header">
                  <div className="card-icon">{therapy.icon}</div>
                  <div className="card-meta">
                    <span className="duration">{therapy.duration}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{therapy.name}</h3>
                  <p className="description">{therapy.description}</p>
                  <div className="instructions">
                    <h4>How to Practice:</h4>
                    <p>{therapy.instructions}</p>
                  </div>
                  <div className="benefits">
                    <h4>Benefits:</h4>
                    <p>{therapy.benefits}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="practice-btn">
                    <span>😌</span> Begin Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="tips-section">
        <h2>Practice Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">⏰</div>
            <h3>Start Small</h3>
            <p>Begin with 5-10 minutes daily and gradually increase duration as you build consistency.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏠</div>
            <h3>Create a Space</h3>
            <p>Dedicate a quiet, comfortable space for your practice to help establish a routine.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📅</div>
            <h3>Be Consistent</h3>
            <p>Practice regularly, even if only for a few minutes, to experience the cumulative benefits.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🫁</div>
            <h3>Listen to Your Body</h3>
            <p>Honor your body's limits and modify poses as needed. Consult a healthcare provider before starting.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YogaMeditation;
