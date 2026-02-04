import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  
  const containerStyle = {
    textAlign: 'center',
    padding: '2rem 0'
  };

  const welcomeStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '1rem'
  };

  const userNameStyle = {
    fontSize: '1.5rem',
    color: 'var(--primary-color)',
    marginBottom: '2rem',
    fontWeight: '600'
  };

  const descriptionStyle = {
    color: 'var(--secondary-color)',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    maxWidth: '600px',
    margin: '0 auto 3rem',
    opacity: 0.8
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '3rem'
  };

  const statCardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--accent-color)',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    color: 'var(--secondary-color)',
    fontSize: '0.95rem',
    fontWeight: '500'
  };

  const roleStyle = {
    display: 'inline-block',
    background: role === 'ADMIN' ? 'var(--gradient-secondary)' : 'var(--gradient-primary)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  };

  return (
    <div style={containerStyle} className="fade-in">
      <h1 style={welcomeStyle}>Welcome to QuizMaster Pro</h1>
      <div style={roleStyle}>{role}</div>
      <h2 style={userNameStyle}>Hello, {user.name}! 👋</h2>
      <p style={descriptionStyle}>
        Your comprehensive quiz management platform. Create engaging quizzes, 
        manage questions, and track performance with our intuitive system.
      </p>
      
      <div style={statsContainerStyle}>
        <div style={statCardStyle} className="slide-in">
          <div style={statNumberStyle}>∞</div>
          <div style={statLabelStyle}>Unlimited Quizzes</div>
        </div>
        <div style={statCardStyle} className="slide-in">
          <div style={statNumberStyle}>⚡</div>
          <div style={statLabelStyle}>Real-time Results</div>
        </div>
        <div style={statCardStyle} className="slide-in">
          <div style={statNumberStyle}>📊</div>
          <div style={statLabelStyle}>Analytics Dashboard</div>
        </div>
      </div>
    </div>
  );
};

export default Home;