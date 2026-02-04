import React, { useState } from 'react';
import { createQuiz } from '../utils/api';

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createQuiz({
        title,
        description,
        timeLimit
      });
      setMessage('Quiz created successfully!');
      setTitle('');
      setDescription('');
      setTimeLimit(10);
    } catch (error) {
      console.error('Quiz creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create quiz. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
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
          <p>Only administrators can create quizzes.</p>
        </div>
      </div>
    );
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: 'var(--secondary-color)',
    opacity: 0.8
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: 'var(--primary-color)'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    transition: 'var(--transition)',
    background: 'white'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
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
    marginTop: '1rem'
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h2 style={titleStyle}>Create New Quiz</h2>
        <p style={subtitleStyle}>Design an engaging quiz for your audience</p>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging quiz title"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description of your quiz"
            style={textareaStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Time Limit (minutes)</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            min="1"
            max="180"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'} style={{ marginTop: '1.5rem' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QuizForm;