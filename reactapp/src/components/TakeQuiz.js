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
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center'
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
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    background: 'white',
    marginBottom: '2rem',
    cursor: 'pointer'
  };

  const buttonStyle = {
    background: 'var(--gradient-primary)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
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
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
    padding: '1.5rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'var(--transition)',
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
                border: selectedQuizId === quiz.id.toString() ? '2px solid var(--accent-color)' : '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onClick={() => setSelectedQuizId(quiz.id.toString())}
              className="slide-in"
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
          background: 'linear-gradient(135deg, rgba(209, 213, 219, 0.1), rgba(209, 213, 219, 0.05))',
          padding: '2rem',
          borderRadius: 'var(--border-radius)',
          marginTop: '2rem',
          color: 'var(--secondary-color)'
        }}>
          <p>No quizzes available at the moment.</p>
        </div>
      )}
    </div>
  );
}