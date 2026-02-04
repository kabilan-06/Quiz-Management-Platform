import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import QuizForm from './components/QuizForm';
import QuestionForm from './components/QuestionForm';
import TakeQuiz from './components/TakeQuiz';
import QuizResults from './components/QuizResults';
import AttendQuiz from './components/AttendQuiz';
import Results from './components/Results';
import { getQuizzes } from './utils/api';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <Router>
      <AppContent quizzes={quizzes} />
    </Router>
  );
}

function AppContent({ quizzes }) {
  const location = useLocation();
  const hideNavbar = ["/", "/signup"].includes(location.pathname);

  if (hideNavbar) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-primary)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          padding: '3rem',
          minWidth: '400px',
          maxWidth: '500px',
          width: '100%'
        }} className="fade-in">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Navbar />
      <main style={{
        paddingTop: '80px',
        padding: '80px 2rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          padding: '2.5rem',
          minHeight: '500px'
        }} className="fade-in">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/create-quiz" element={<QuizForm />} />
            <Route path="/add-question" element={<QuestionForm quizzes={quizzes} />} />
            <Route path="/take-quiz" element={<TakeQuiz quizzes={quizzes} />} />
            <Route path="/take-quiz/:quizId" element={<AttendQuiz />} />
            <Route path="/results/:quizId" element={<QuizResults />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
