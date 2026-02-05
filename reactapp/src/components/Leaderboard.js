import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard({ quizId }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!quizId) return;
        setLoading(true);
        axios
            .get(`https://quiz-management-platform.onrender.com/api/quiz-attempts/quizzes/${quizId}/attempts`)
            .then((res) => {
                // Sort by score descending, then by completion time ascending
                const sorted = res.data.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return new Date(a.completedAt) - new Date(b.completedAt);
                });
                setLeaderboard(sorted);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load leaderboard");
                setLoading(false);
            });
    }, [quizId]);

    if (!quizId) return null;
    if (loading) return <p>Loading leaderboard...</p>;
    if (error) return <p>{error}</p>;
    if (leaderboard.length === 0) return <p>No attempts yet.</p>;

    return (
        <div style={{ marginTop: "2rem", background: "#f8fafc", borderRadius: 8, padding: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2193b0" }}>Leaderboard</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#e3f2fd" }}>
                        <th style={{ padding: "0.5rem" }}>Rank</th>
                        <th style={{ padding: "0.5rem" }}>Student</th>
                        <th style={{ padding: "0.5rem" }}>Score</th>
                        <th style={{ padding: "0.5rem" }}>Completed At</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((attempt, idx) => (
                        <tr key={attempt.id} style={{ background: idx < 3 ? "#fffde7" : "white" }}>
                            <td style={{ textAlign: "center", fontWeight: idx < 3 ? 700 : 400 }}>
                                {idx + 1}
                                {idx === 0 ? " 🥇" : idx === 1 ? " 🥈" : idx === 2 ? " 🥉" : ""}
                            </td>
                            <td>{attempt.studentName || "Unknown"}</td>
                            <td style={{ textAlign: "center" }}>{attempt.score} / {attempt.totalQuestions}</td>
                            <td>{attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
