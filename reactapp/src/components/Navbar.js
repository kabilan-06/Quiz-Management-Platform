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
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  };

  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    textDecoration: 'none',
    letterSpacing: '-0.025em'
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