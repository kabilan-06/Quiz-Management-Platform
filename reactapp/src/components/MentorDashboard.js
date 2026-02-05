import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MentorDashboard() {
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const mentor = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!mentor || mentor.role !== "MENTOR") return;
        axios
            .get(`https://quiz-management-platform.onrender.com/api/auth/users?mentorId=${mentor.id}`)
            .then((res) => {
                setMentees(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch mentees");
                setLoading(false);
            });
    }, [mentor]);

    return (
        <div style={{ padding: "2rem", background: "#f8f9fa", minHeight: "100vh" }}>
            <h1 style={{ color: "#3a86ff", fontWeight: 700, fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                Mentor Dashboard
            </h1>
            {loading && <p>Loading mentees...</p>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {!loading && mentees.length === 0 && <p>No mentees assigned yet.</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                {mentees.map((mentee) => (
                    <div
                        key={mentee.id}
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 4px 24px rgba(58,134,255,0.08)",
                            padding: "2rem",
                            minWidth: "260px",
                            flex: "1 1 300px",
                        }}
                    >
                        <h3 style={{ color: "#3a86ff", marginBottom: "0.5rem" }}>{mentee.name}</h3>
                        <p style={{ color: "#555", marginBottom: "0.5rem" }}>{mentee.email}</p>
                        <MenteeResults userId={mentee.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function MenteeResults({ userId }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`https://quiz-management-platform.onrender.com/api/quiz-attempts/user/${userId}`)
            .then((res) => {
                setResults(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    if (loading) return <p style={{ color: "#aaa" }}>Loading results...</p>;
    if (results.length === 0) return <p style={{ color: "#aaa" }}>No quiz results yet.</p>;

    return (
        <div style={{ marginTop: "1rem" }}>
            <h4 style={{ color: "#3a86ff", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Quiz Results</h4>
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {results.map((r) => (
                    <li key={r.id} style={{ marginBottom: "0.5rem", color: "#222" }}>
                        <b>{r.quizTitle || "Quiz"}:</b> {r.score} / {r.totalQuestions}
                    </li>
                ))}
            </ul>
        </div>
    );
}
