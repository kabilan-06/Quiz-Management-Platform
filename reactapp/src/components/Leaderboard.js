import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://quiz-management-platform.onrender.com/api";

export default function Leaderboard({ quizId, currentUser }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!quizId) return;
        setLoading(true);
        setError(null);
        axios
            .get(`${API_BASE_URL}/quiz-attempts/quizzes/${quizId}/attempts`)
            .then((res) => {
                // Highest score first; earlier submissions break ties.
                const sorted = (res.data ?? []).sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return new Date(a.completedAt ?? 0) - new Date(b.completedAt ?? 0);
                });
                setLeaderboard(sorted.slice(0, 25));
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load the leaderboard. Try again in a moment.");
                setLoading(false);
            });
    }, [quizId]);

    if (!quizId) return null;
    if (loading) return <div className="loading-state">Loading leaderboard...</div>;
    if (error) return <div className="notice error">{error}</div>;
    if (leaderboard.length === 0) {
        return (
            <div className="empty-state">
                <span className="eyebrow">No attempts yet</span>
                <p>Be the first student on this board.</p>
            </div>
        );
    }

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="leaderboard-panel">
            {leaderboard.map((attempt, idx) => {
                const mine = currentUser && String(attempt.userId ?? "") === String(currentUser.id);
                return (
                    <article className={`leader-row board-row ${mine ? "mine" : ""}`} key={attempt.id ?? `${attempt.studentName}-${idx}`}>
                        <span className="rank">{medals[idx] ?? `#${idx + 1}`}</span>
                        <strong>{attempt.studentName || "Unknown"}{mine ? " (you)" : ""}</strong>
                        <em>
                            {attempt.score}/{attempt.totalQuestions}
                            {" · "}
                            {attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0}%
                        </em>
                        <span className="lb-at">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : "—"}</span>
                    </article>
                );
            })}
        </div>
    );
}
