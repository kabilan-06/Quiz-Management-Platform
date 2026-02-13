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
import TeamQuiz from './components/TeamQuiz';
import Flashcards from './components/Flashcards';
import Login from './components/Login';
import Signup from './components/Signup';
import MentorDashboard from './components/MentorDashboard';

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
            <Route path="/team-quiz" element={<TeamQuiz quizzes={quizzes} />} />
            <Route path="/flashcards" element={<Flashcards />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      color: '#1a202c'
    }}>
      <Navbar />
      <main style={{
        paddingTop: '90px',
        padding: '90px 1.5rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          padding: '2.5rem',
          minHeight: '500px',
          transition: 'all 0.3s ease',
        }} className="fade-in">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/create-quiz" element={<QuizForm />} />
            <Route path="/add-question" element={<QuestionForm quizzes={quizzes} />} />
            <Route path="/take-quiz" element={<TakeQuiz quizzes={quizzes} />} />
            <Route path="/take-quiz/:quizId" element={<AttendQuiz />} />
            <Route path="/results/:quizId" element={<QuizResults />} />
            <Route path="/results" element={<Results />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
