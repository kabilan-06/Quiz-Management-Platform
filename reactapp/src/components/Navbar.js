import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState('medium');

  const handleFontSize = (size) => {
    setFontSize(size);
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.body.classList.add(`font-size-${size}`);
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
  };

  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textDecoration: 'none',
    letterSpacing: '-0.025em'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: '#4a5568',
    textDecoration: 'none',
    padding: '0.625rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    fontSize: '0.9rem',
    position: 'relative'
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
  };

  const logoutStyle = {
    ...linkStyle,
    background: '#e53e3e',
    color: 'white',
    marginLeft: '0.5rem'
  };

  return (
    <nav style={navStyle} className="slide-in">
      <Link to="/home" style={brandStyle}>
        QuizMaster Pro
      </Link>

      <div style={{ ...navLinksStyle, gap: '1.5rem' }}>
        <Link
          to="/home"
          style={location.pathname === '/home' ? activeLinkStyle : linkStyle}
        >
          {t('dashboard')}
        </Link>
        {role === "MENTOR" && (
          <Link
            to="/mentor-dashboard"
            style={location.pathname === '/mentor-dashboard' ? activeLinkStyle : linkStyle}
          >
            {t('mentorDashboard')}
          </Link>
        )}

        {role === "ADMIN" && (
          <>
            <Link
              to="/create-quiz"
              style={location.pathname === '/create-quiz' ? activeLinkStyle : linkStyle}
            >
              Add Quizzes
            </Link>
            <Link
              to="/add-question"
              style={location.pathname === '/add-question' ? activeLinkStyle : linkStyle}
            >
              Create Quizzes
            </Link>
          </>
        )}

        {role === "USER" && (
          <>
            <Link
              to="/take-quiz"
              style={location.pathname === '/take-quiz' ? activeLinkStyle : linkStyle}
            >
              {t('startQuiz')}
            </Link>
            <Link
              to="/results"
              style={location.pathname === '/results' ? activeLinkStyle : linkStyle}
            >
              {t('viewResults')}
            </Link>
          </>
        )}

        <Link
          to="/"
          style={logoutStyle}
        >
          {t('logout')}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              ...linkStyle, 
              background: isDark ? '#2d3748' : '#f7fafc', 
              color: isDark ? '#fff' : '#2d3748',
              border: '1px solid ' + (isDark ? '#4a5568' : '#e2e8f0'),
              padding: '0.5rem 0.875rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
          </button>
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)} 
            style={{ 
              ...linkStyle, 
              padding: '0.5rem 0.75rem',
              fontSize: '0.85rem',
              border: '1px solid #e2e8f0',
              background: '#f7fafc',
              color: '#2d3748',
              cursor: 'pointer'
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
          <select 
            value={fontSize} 
            onChange={e => handleFontSize(e.target.value)} 
            style={{ 
              ...linkStyle, 
              padding: '0.5rem 0.75rem',
              fontSize: '0.85rem',
              border: '1px solid #e2e8f0',
              background: '#f7fafc',
              color: '#2d3748',
              cursor: 'pointer'
            }}
          >
            <option value="small">A-</option>
            <option value="medium">A</option>
            <option value="large">A+</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
