import React, { useState } from 'react';
import Notification from './Notification';
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

  // Notification demo
  const [notif, setNotif] = useState({ message: '', type: 'info' });
  const showSuccess = () => setNotif({ message: 'Welcome back! 🎉', type: 'success' });
  const showError = () => setNotif({ message: 'Something went wrong!', type: 'error' });

  const avatarStyle = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    color: '#fff',
    marginBottom: 16,
    boxShadow: '0 2px 8px #c2e9fb',
  };

  const displayName = user?.name || 'Guest';
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';

  return (
    <div style={containerStyle} className="fade-in">
      <Notification message={notif.message} type={notif.type} onClose={() => setNotif({ message: '', type: 'info' })} />
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
      <div style={{ margin: '1.5rem 0' }}>
        <button onClick={showSuccess} style={{ marginRight: 12, background: '#38b000', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Show Success</button>
        <button onClick={showError} style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Show Error</button>
      </div>
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
          <div style={{ marginTop: '1rem', height: 120, background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a86ff', fontWeight: 700, fontSize: 24, opacity: 0.7 }}>
            [Chart Coming Soon]
          </div>
        </div>
      </div>
      {user && (
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <button onClick={() => navigate('/take-quiz')} style={{ background: '#3a86ff', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Start a Quiz</button>
          <button onClick={() => navigate('/results')} style={{ background: '#38b000', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>View Results</button>
          <button onClick={() => navigate('/flashcards')} style={{ background: '#ffb300', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Study Flashcards</button>
          <button onClick={() => navigate('/team-quiz')} style={{ background: '#8e24aa', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Team Quiz</button>
          <button onClick={() => alert('Tutorial coming soon!')} style={{ background: '#3a86ff', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Show Tutorial</button>
          <button onClick={() => navigate('/profile')} style={{ background: '#e63946', color: '#fff', padding: '0.75rem 2rem', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Home;