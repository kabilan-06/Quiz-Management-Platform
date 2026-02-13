import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TakeQuiz({ quizzes }) {
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (!selectedQuizId) {
      alert("Please select a quiz first!");
      return;
    }
    navigate(`/take-quiz/${selectedQuizId}`);
  };

  const role = localStorage.getItem("role");
  if (role !== "USER") {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(229, 62, 62, 0.1), rgba(229, 62, 62, 0.05))',
          padding: '2rem',
          borderRadius: 'var(--border-radius)',
          border: '2px solid var(--error-color)',
          color: 'var(--error-color)'
        }}>
          <h3>Access Denied</h3>
          <p>Only users can take quizzes.</p>
        </div>
      </div>
    );
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '2rem 1rem'
  };

  const headerStyle = {
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: 'var(--secondary-color)',
    fontSize: '1.1rem',
    opacity: 0.8
  };

  const selectStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'white',
    marginBottom: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 2.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    minWidth: '200px'
  };

  const quizGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  };

  const quizCardStyle = {
    background: 'white',
    padding: '1.75rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left'
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h2 style={titleStyle}>Take a Quiz</h2>
        <p style={subtitleStyle}>Choose a quiz to test your knowledge</p>
      </div>

      <select
        value={selectedQuizId}
        onChange={(e) => setSelectedQuizId(e.target.value)}
        style={selectStyle}
      >
        <option value="">-- Select a Quiz --</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title} ({quiz.timeLimit} minutes)
          </option>
        ))}
      </select>

      <button
        onClick={handleStartQuiz}
        disabled={!selectedQuizId}
        style={{
          ...buttonStyle,
          opacity: !selectedQuizId ? 0.5 : 1,
          cursor: !selectedQuizId ? 'not-allowed' : 'pointer'
        }}
      >
        Start Quiz
      </button>

      {quizzes.length > 0 && (
        <div style={quizGridStyle}>
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={{
                ...quizCardStyle,
                border: selectedQuizId === quiz.id.toString() ? '2px solid #667eea' : '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: selectedQuizId === quiz.id.toString() ? '0 8px 30px rgba(102, 126, 234, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.06)'
              }}
              onClick={() => setSelectedQuizId(quiz.id.toString())}
              className="slide-in"
              onMouseOver={(e) => {
                if (selectedQuizId !== quiz.id.toString()) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedQuizId !== quiz.id.toString()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                }
              }}
            >
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                {quiz.title}
              </h4>
              <p style={{ color: 'var(--secondary-color)', marginBottom: '1rem', opacity: 0.8 }}>
                {quiz.description || 'No description available'}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.9rem',
                color: 'var(--accent-color)',
                fontWeight: '500'
              }}>
                <span>⏱️ {quiz.timeLimit} minutes</span>
                <span>📝 Quiz #{quiz.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {quizzes.length === 0 && (
        <div style={{
          background: 'white',
          padding: '3rem 2rem',
          borderRadius: '16px',
          marginTop: '2rem',
          color: '#718096',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
          <p style={{ margin: 0, fontSize: '1.05rem' }}>No quizzes available at the moment.</p>
        </div>
      )}
    </div>
  );
}