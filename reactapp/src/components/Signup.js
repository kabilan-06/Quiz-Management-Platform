import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        password,
        role,
      });
      if (res.data === "Signup successful") {
        navigate("/");
      } else {
        setError(res.data || "Signup failed");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Signup failed. Please check your details and try again.");
      }
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
    background: 'var(--gradient-secondary)',
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
    background: 'var(--gradient-secondary)',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)'
  };

  const linkStyle = {
    color: 'var(--accent-color)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'var(--transition)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Join QuizMaster Pro</h1>
      <p style={subtitleStyle}>Create your account to get started</p>

      {error && (
        <div className="error" style={{ marginBottom: '1.5rem' }}>
          {typeof error === "object"
            ? error.message || JSON.stringify(error)
            : error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ marginTop: '2rem', color: 'var(--secondary-color)' }}>
        Already have an account?{' '}
        <Link to="/" style={linkStyle}>
          Sign In
        </Link>
      </p>
    </div>
  );
}