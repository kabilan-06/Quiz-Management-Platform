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
        const response = await axios.get(`http://localhost:8080/api/quiz-attempts/user/${user.id}`);
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
    padding: '2rem 0'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const resultCardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
    padding: '1.5rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    marginBottom: '1rem'
  };

  const scoreStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--accent-color)'
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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
          padding: '2rem',
          borderRadius: 'var(--border-radius)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          color: 'var(--secondary-color)'
        }}>
          <p>No quiz results found. Take a quiz to see your results here!</p>
        </div>
      ) : (
        <div>
          {results.map((result) => (
            <div key={result.id} style={resultCardStyle} className="slide-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Quiz #{result.quizId}</h3>
                <span style={scoreStyle}>{result.score}/{result.totalQuestions}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                <div>
                  <strong>Score:</strong> {Math.round((result.score / result.totalQuestions) * 100)}%
                </div>
                <div>
                  <strong>Date:</strong> {new Date(result.completedAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {new Date(result.completedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;