import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
    backdropFilter: 'blur(24px)',
    borderBottom: '2px solid #e0e7ef',
    padding: '1.2rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(58,134,255,0.08)'
  };

  const brandStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#3a86ff',
    textDecoration: 'none',
    letterSpacing: '-0.025em',
    textShadow: '0 2px 8px #c2e9fb',
    fontFamily: 'Segoe UI, Arial, sans-serif'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'var(--secondary-color)',
    textDecoration: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--border-radius)',
    transition: 'var(--transition)',
    fontWeight: '500',
    fontSize: '0.95rem',
    position: 'relative'
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: 'var(--gradient-primary)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  };

  const logoutStyle = {
    ...linkStyle,
    background: 'var(--error-color)',
    color: 'white',
    marginLeft: '1rem'
  };

  return (
    <nav style={navStyle} className="slide-in">
      <Link to="/home" style={brandStyle}>
        QuizMaster Pro
      </Link>

      <div style={navLinksStyle}>
        <Link
          to="/home"
          style={location.pathname === '/home' ? activeLinkStyle : linkStyle}
        >
          Dashboard
        </Link>
        {role === "MENTOR" && (
          <Link
            to="/mentor-dashboard"
            style={location.pathname === '/mentor-dashboard' ? activeLinkStyle : linkStyle}
          >
            Mentor Dashboard
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
              Start Quiz
            </Link>
            <Link
              to="/results"
              style={location.pathname === '/results' ? activeLinkStyle : linkStyle}
            >
              Results
            </Link>
          </>
        )}

        <Link
          to="/"
          style={logoutStyle}
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;