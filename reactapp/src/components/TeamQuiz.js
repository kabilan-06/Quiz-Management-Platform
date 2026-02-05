import React, { useState } from "react";

export default function TeamQuiz({ quizzes }) {
    const [teamName, setTeamName] = useState("");
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [members, setMembers] = useState([""]);

    const handleAddMember = () => setMembers([...members, ""]);
    const handleMemberChange = (i, val) => {
        const updated = [...members];
        updated[i] = val;
        setMembers(updated);
    };

    const handleStart = () => {
        if (!teamName || !selectedQuizId || members.some(m => !m)) {
            alert("Please fill all fields and add at least one member.");
            return;
        }
        // In a real app, send team info to backend and start quiz
        alert(`Team '${teamName}' is starting quiz #${selectedQuizId} with members: ${members.join(", ")}`);
    };

    return (
        <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#f8fafc", borderRadius: 12 }}>
            <h2 style={{ marginBottom: 16 }}>Start a Team Quiz</h2>
            <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            />
            <select
                value={selectedQuizId}
                onChange={e => setSelectedQuizId(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            >
                <option value="">-- Select a Quiz --</option>
                {quizzes && quizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                ))}
            </select>
            <div style={{ marginBottom: 12 }}>
                <b>Team Members:</b>
                {members.map((m, i) => (
                    <input
                        key={i}
                        type="text"
                        placeholder={`Member ${i + 1}`}
                        value={m}
                        onChange={e => handleMemberChange(i, e.target.value)}
                        style={{ width: "100%", marginBottom: 6, padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
                    />
                ))}
                <button onClick={handleAddMember} style={{ marginTop: 6, background: '#2193b0', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>+ Add Member</button>
            </div>
            <button onClick={handleStart} style={{ background: '#38b000', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Start Team Quiz</button>
        </div>
    );
}
