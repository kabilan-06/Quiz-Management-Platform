import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("role", response.data.role);
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: 'var(--secondary-color)',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    opacity: 0.8
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputStyle = {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    transition: 'var(--transition)',
    background: 'white'
  };

  const buttonStyle = {
    background: 'var(--gradient-primary)',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  };

  const linkStyle = {
    color: 'var(--accent-color)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'var(--transition)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>QuizMaster Pro</h1>
      <p style={subtitleStyle}>Sign in to your account</p>

      {error && (
        <div className="error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={formStyle}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ marginTop: '2rem', color: 'var(--secondary-color)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={linkStyle}>
          Create Account
        </Link>
      </p>
    </div>
  );
}