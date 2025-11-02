import React, { useState } from 'react';

const Remedies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const remedies = [
    {
      title: 'Cold & Flu',
      description: 'Natural remedies for cold and flu symptoms.',
      category: 'respiratory',
      icon: '🤧',
      remedies: [
        'Drink warm ginger tea with honey.',
        'Steam inhalation with eucalyptus oil.',
        'Rest and stay hydrated.',
        'Eat chicken soup with garlic.'
      ],
      precautions: 'Consult doctor if symptoms persist beyond 7 days.'
    },
    {
      title: 'Digestive Issues',
      description: 'Home remedies for indigestion and bloating.',
      category: 'digestive',
      icon: '🤢',
      remedies: [
        'Drink peppermint tea.',
        'Eat probiotic-rich foods like yogurt.',
        'Chew fennel seeds after meals.',
        'Drink warm water with lemon.'
      ],
      precautions: 'Avoid if you have acid reflux or GERD.'
    },
    {
      title: 'Headache Relief',
      description: 'Natural ways to alleviate headaches.',
      category: 'pain',
      icon: '🤕',
      remedies: [
        'Apply peppermint oil to temples.',
        'Drink chamomile tea.',
        'Practice deep breathing exercises.',
        'Apply cold compress to forehead.'
      ],
      precautions: 'Seek medical attention for severe or persistent headaches.'
    },
    {
      title: 'Sleep Problems',
      description: 'Natural solutions for better sleep quality.',
      category: 'sleep',
      icon: '😴',
      remedies: [
        'Drink warm milk with turmeric.',
        'Practice evening meditation.',
        'Create a consistent sleep schedule.',
        'Use lavender essential oil.'
      ],
      precautions: 'Establish a regular sleep routine for best results.'
    },
    {
      title: 'Skin Care',
      description: 'Natural remedies for common skin issues.',
      category: 'skin',
      icon: '✨',
      remedies: [
        'Apply aloe vera gel for sunburn.',
        'Use honey as a natural moisturizer.',
        'Apply cucumber slices for puffy eyes.',
        'Use oatmeal paste for itchy skin.'
      ],
      precautions: 'Patch test natural remedies before widespread use.'
    },
    {
      title: 'Energy Boost',
      description: 'Natural ways to increase energy levels.',
      category: 'energy',
      icon: '⚡',
      remedies: [
        'Eat nuts and seeds.',
        'Drink green tea.',
        'Take short walks in nature.',
        'Practice morning sun salutation.'
      ],
      precautions: 'Combine with adequate sleep and nutrition.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Remedies', icon: '🌿' },
    { value: 'respiratory', label: 'Respiratory', icon: '🫁' },
    { value: 'digestive', label: 'Digestive', icon: '🍽️' },
    { value: 'pain', label: 'Pain Relief', icon: '💊' },
    { value: 'sleep', label: 'Sleep', icon: '🌙' },
    { value: 'skin', label: 'Skin Care', icon: '🧴' },
    { value: 'energy', label: 'Energy', icon: '🔋' }
  ];

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || remedy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="remedies-page">
      {/* Hero Section */}
      <div className="page-hero">
        <div className="hero-content">
          <h1>Home Remedies</h1>
          <p>Discover nature's pharmacy. Explore time-tested natural remedies for common health concerns and wellness.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Remedy Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Natural Solutions</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Natural</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <span className="floating-icon">🌿</span>
            <span className="floating-icon">🌸</span>
            <span className="floating-icon">🫒</span>
            <span className="floating-icon">🍯</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search remedies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.value}
              className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="filter-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Remedies Grid */}
      <section className="remedies-section">
        <div className="section-header">
          <h2>Natural Remedies</h2>
          <p>Explore our collection of effective, natural remedies for common health concerns.</p>
        </div>

        {filteredRemedies.length > 0 ? (
          <div className="remedies-grid">
            {filteredRemedies.map((remedy, index) => (
              <div key={index} className="remedy-card">
                <div className="card-header">
                  <div className="card-icon">{remedy.icon}</div>
                  <span className={`category-badge ${remedy.category}`}>
                    {remedy.category}
                  </span>
                </div>

                <div className="card-content">
                  <h3>{remedy.title}</h3>
                  <p className="description">{remedy.description}</p>

                  <div className="remedies-list">
                    <h4>Try These Remedies:</h4>
                    <ul>
                      {remedy.remedies.map((item, i) => (
                        <li key={i}>
                          <span className="remedy-check">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="precautions">
                    <h4>⚠️ Important:</h4>
                    <p>{remedy.precautions}</p>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="remedy-btn">
                    <span>📋</span> Save Remedy
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No remedies found</h3>
            <p>Try adjusting your search terms or category filter.</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <h2>Remedy Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🧪</div>
            <h3>Test First</h3>
            <p>Always patch test natural remedies on a small area of skin before widespread use.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">👨‍⚕️</div>
            <h3>Consult Professionals</h3>
            <p>While natural remedies can help, consult healthcare providers for serious conditions.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⏱️</div>
            <h3>Be Patient</h3>
            <p>Natural remedies often take time to show effects. Give them a few days to work.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🌱</div>
            <h3>Quality Matters</h3>
            <p>Use fresh, high-quality ingredients for best results and safety.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Remedies;
