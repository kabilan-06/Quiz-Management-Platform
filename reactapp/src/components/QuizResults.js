// src/components/QuizResults.js
import React, { useEffect, useState, useMemo } from "react";
import Leaderboard from "./Leaderboard";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [quizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "USER" && quizId) {
      setLoading(true);
      axios
        .get(`https://quiz-management-platform.onrender.com/api/quiz-attempts/quizzes/${quizId}/attempts`)
        .then((res) => {
          setAttempts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch quiz results:", err);
          setLoading(false);
        });
    }
  }, [role, quizId]);

  const analytics = useMemo(() => {
    if (!attempts.length) return null;
    const scores = attempts.map(a => a.score);
    const best = Math.max(...scores);
    const worst = Math.min(...scores);
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    return { best, worst, avg };
  }, [attempts]);

  const handleExport = () => {
    const csv = [
      ["Student", "Score", "Total Questions", "Completed At"],
      ...attempts.map(a => [a.studentName, a.score, a.totalQuestions, a.completedAt])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz_results_${quizId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (role !== "USER") return <p>Access denied. Only users can view results.</p>;

  if (loading) return <p>Loading...</p>;

  if (!quizId) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <h2>All Quizzes</h2>
        {quizzes.length === 0 && <p>No quizzes found.</p>}
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              padding: "0.5rem",
              border: "1px solid #ddd",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/results/${quiz.id}`)}
          >
            {quiz.title || `Quiz #${quiz.id}`}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Quiz Results</h2>
      <button onClick={handleExport} style={{ marginBottom: 16, background: '#667eea', color: '#fff', border: 'none', borderRadius: 12, padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Export CSV</button>
      {analytics && (
        <div style={{ marginBottom: 16, background: '#f1f8e9', padding: 12, borderRadius: 8 }}>
          <b>Analytics:</b> Avg Score: {analytics.avg} | Best: {analytics.best} | Worst: {analytics.worst}
        </div>
      )}
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <p>
            <strong>Student:</strong> {attempt.studentName || user.name}
          </p>
          <p>
            <strong>Score:</strong> {attempt.score} / {attempt.totalQuestions}
          </p>
          <p>
            <strong>Completed At:</strong> {attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "-"}
          </p>
        </div>
      ))}
      <Leaderboard quizId={quizId} />
    </div>
  );
}
