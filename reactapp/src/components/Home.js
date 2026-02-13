import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }
  const role = user?.role || localStorage.getItem("role") || "USER";

  const containerStyle = {
    textAlign: 'center',
    padding: '3rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '3rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    cursor: 'default'
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

  const avatarStyle = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
  };

  const displayName = user?.name || 'Guest';
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';

  return (
    <div style={containerStyle} className="fade-in">
      <h1 style={welcomeStyle}>Welcome to QuizMaster Pro</h1>
      <div style={roleStyle}>{displayRole}</div>
      <div style={avatarStyle}>{displayName[0]}</div>
      <h2 style={userNameStyle}>Hello, {displayName}! 👋</h2>
      <p style={descriptionStyle}>
        Your comprehensive quiz management platform. Create engaging quizzes,
        manage questions, and track performance with our intuitive system.
      </p>
      {!user && (
        <div style={{ margin: '1.5rem 0', color: '#e63946', fontWeight: 600 }}>
          You are not logged in. Please <a href="/" style={{ color: '#3a86ff', textDecoration: 'underline' }}>login</a> to access all features.
        </div>
      )}
      {/* Removed demo notification buttons for cleaner UI */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle} className="slide-in">
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>∞</div>
          <div style={statLabelStyle}>Unlimited Quizzes</div>
        </div>
        <div style={statCardStyle} className="slide-in">
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚡</div>
          <div style={statLabelStyle}>Real-time Results</div>
        </div>
        <div style={statCardStyle} className="slide-in">
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📊</div>
          <div style={statLabelStyle}>Analytics Dashboard</div>
        </div>
      </div>
      {user && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '900px', margin: '2rem auto 0' }}>
          <button onClick={() => navigate('/take-quiz')} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', transition: 'all 0.3s ease', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Start a Quiz</button>
          <button onClick={() => navigate('/results')} style={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)', transition: 'all 0.3s ease', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>View Results</button>
          <button onClick={() => navigate('/flashcards')} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)', transition: 'all 0.3s ease', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Study Flashcards</button>
          <button onClick={() => navigate('/team-quiz')} style={{ background: 'linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(142, 36, 170, 0.3)', transition: 'all 0.3s ease', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Team Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Home;