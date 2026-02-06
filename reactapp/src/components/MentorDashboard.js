
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MentorDashboard() {
    let mentor = null;
    try {
        mentor = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        mentor = null;
    }
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const avatarStyle = {
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        color: '#fff',
        marginBottom: 16,
        boxShadow: '0 2px 8px #c2e9fb',
    };

    return (
        <div style={{ padding: "2rem", background: "#f8f9fa", minHeight: "100vh" }}>
            <h1 style={{ color: "#3a86ff", fontWeight: 700, fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                Mentor Dashboard
            </h1>
            {mentor && (
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <div style={avatarStyle}>{mentor.name ? mentor.name[0] : 'M'}</div>
                    <div style={{ fontWeight: 700, fontSize: 20 }}>{mentor.name || 'Mentor'}</div>
                    <div style={{ color: '#555', fontSize: 16 }}>ID: {mentor.id}</div>
                </div>
            )}
            {loading && <p>Loading mentees...</p>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {!loading && mentees.length === 0 && (
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 24px rgba(58,134,255,0.08)',
                    padding: '2.5rem',
                    maxWidth: 480,
                    margin: '2rem auto',
                    textAlign: 'center',
                }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="No mentees" style={{ width: 96, marginBottom: 16, opacity: 0.7 }} />
                    <h3 style={{ color: '#3a86ff', marginBottom: 8 }}>No mentees assigned yet</h3>
                    <p style={{ color: '#555', marginBottom: 0 }}>
                        Invite users to select you as their mentor. Once users assign you, their progress and results will appear here.
                    </p>
                </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                {(Array.isArray(mentees) ? mentees : []).map((mentee) => (
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
                        <div style={{ color: "#555", marginBottom: "0.5rem" }}>ID: {mentee.id}</div>
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
                {(Array.isArray(results) ? results : []).map((r) => (
                    <li key={r.id} style={{ marginBottom: "0.5rem", color: "#222" }}>
                        <b>{r.quizTitle || "Quiz"}:</b> {r.score} / {r.totalQuestions}
                    </li>
                ))}
            </ul>
        </div>
    );
}
