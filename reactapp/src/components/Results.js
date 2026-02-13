import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`https://quiz-management-platform.onrender.com/api/quiz-attempts/user/${user.id}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const containerStyle = {
    padding: '2rem 1rem',
    maxWidth: '900px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const resultCardStyle = {
    background: 'white',
    padding: '1.75rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
  };

  const scoreStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading">Loading your results...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="fade-in">
      <h2 style={titleStyle}>My Quiz Results</h2>

      {results.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          color: '#718096'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📈</div>
          <p style={{ margin: 0, fontSize: '1.05rem' }}>No quiz results found. Take a quiz to see your results here!</p>
        </div>
      ) : (
        <div>
          {results.map((result) => {
            const percentage = Math.round((result.score / result.totalQuestions) * 100);
            const isPassing = percentage >= 70;
            
            return (
              <div 
                key={result.id} 
                style={resultCardStyle} 
                className="slide-in"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ color: '#1a365d', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Quiz #{result.quizId}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={scoreStyle}>{result.score}/{result.totalQuestions}</span>
                    <div style={{
                      background: isPassing ? 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)' : 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                      color: 'white',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {percentage}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e2e8f0', 
                  borderRadius: '4px', 
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: isPassing ? 'linear-gradient(90deg, #38a169 0%, #2f855a 100%)' : 'linear-gradient(90deg, #e53e3e 0%, #c53030 100%)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#4a5568' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🎯</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Score</div>
                      <div style={{ fontWeight: '600' }}>{percentage}%</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📅</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Date</div>
                      <div style={{ fontWeight: '600' }}>{new Date(result.completedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⏰</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Time</div>
                      <div style={{ fontWeight: '600' }}>{new Date(result.completedAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;