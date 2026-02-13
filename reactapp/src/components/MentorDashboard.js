
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
    const [searchTerm, setSearchTerm] = useState("");

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
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
        flexShrink: 0
    };

    const filteredMentees = (Array.isArray(mentees) ? mentees : []).filter(mentee => 
        mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.id.toString().includes(searchTerm)
    );

    return (
        <div style={{ padding: "2rem", minHeight: "100vh", maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: "#1a365d", fontWeight: 700, fontSize: "2.25rem", marginBottom: "0.5rem" }}>
                    Mentor Dashboard
                </h1>
                <p style={{ color: '#4a5568', fontSize: '1.05rem' }}>Monitor and track your mentees' progress</p>
            </div>
            
            {mentor && (
                <div style={{ 
                    marginBottom: '2rem', 
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <div style={avatarStyle}>{mentor.name ? mentor.name[0].toUpperCase() : 'M'}</div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1a365d', marginBottom: '0.25rem' }}>{mentor.name || 'Mentor'}</div>
                        <div style={{ color: '#718096', fontSize: '0.95rem' }}>Mentor ID: {mentor.id}</div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="🔍 Search students by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '0.875rem 1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.05rem' }}>Loading mentees...</p>}
            {error && <div style={{ color: "#e53e3e", textAlign: 'center', padding: '1rem', background: 'rgba(229, 62, 62, 0.1)', borderRadius: '12px' }}>{error}</div>}
            
            {!loading && filteredMentees.length === 0 && searchTerm === "" && (
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    padding: '3rem 2rem',
                    maxWidth: 480,
                    margin: '2rem auto',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>👥</div>
                    <h3 style={{ color: '#1a365d', marginBottom: '0.75rem', fontSize: '1.5rem' }}>No mentees assigned yet</h3>
                    <p style={{ color: '#718096', marginBottom: 0, lineHeight: 1.6 }}>
                        Students will appear here once they select you as their mentor.
                    </p>
                </div>
            )}

            {!loading && filteredMentees.length === 0 && searchTerm !== "" && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    No students found matching "{searchTerm}"
                </div>
            )}

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
                gap: "1.5rem" 
            }}>
                {filteredMentees.map((mentee) => (
                    <div
                        key={mentee.id}
                        style={{
                            background: "white",
                            borderRadius: "16px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                            padding: "1.75rem",
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                ...avatarStyle,
                                width: 48,
                                height: 48,
                                fontSize: 20,
                                marginBottom: 0
                            }}>
                                {mentee.name ? mentee.name[0].toUpperCase() : 'S'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ color: "#1a365d", marginBottom: "0.25rem", fontSize: '1.15rem', fontWeight: '600' }}>{mentee.name}</h3>
                                <div style={{ color: "#718096", fontSize: '0.85rem' }}>ID: {mentee.id}</div>
                            </div>
                        </div>
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

    if (loading) return <p style={{ color: "#a0aec0", fontSize: '0.9rem', margin: '0.5rem 0' }}>Loading results...</p>;
    if (results.length === 0) return <p style={{ color: "#a0aec0", fontSize: '0.9rem', fontStyle: 'italic', margin: '0.5rem 0' }}>No quiz results yet</p>;

    return (
        <div style={{ marginTop: "1rem", paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ color: "#1a365d", fontSize: "1rem", marginBottom: "0.75rem", fontWeight: '600' }}>Quiz Results</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(Array.isArray(results) ? results : []).slice(0, 3).map((r) => (
                    <div key={r.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.625rem 0.875rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: '#2d3748', fontWeight: '500' }}>{r.quizTitle || `Quiz #${r.quizId}`}</span>
                        <span style={{ 
                            color: r.score / r.totalQuestions >= 0.7 ? '#38a169' : r.score / r.totalQuestions >= 0.5 ? '#d69e2e' : '#e53e3e',
                            fontWeight: '700'
                        }}>
                            {r.score}/{r.totalQuestions}
                        </span>
                    </div>
                ))}
                {results.length > 3 && (
                    <div style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.25rem', textAlign: 'center' }}>
                        +{results.length - 3} more results
                    </div>
                )}
            </div>
        </div>
    );
}
