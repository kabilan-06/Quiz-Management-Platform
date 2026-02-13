import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLanguage } from '../contexts/LanguageContext';
import styles from './Dashboard.module.css';

export default function MentorDashboard() {
    const { t } = useLanguage();
    const [mentor, setMentor] = useState(null);
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.role === "MENTOR") {
                setMentor(user);
            }
        } catch (e) {
            console.error("Error parsing user:", e);
        }
    }, []);

    useEffect(() => {
        if (!mentor) return;
        
        setLoading(true);
        axios
            .get(`https://quiz-management-platform.onrender.com/api/auth/users?mentorId=${mentor.id}`)
            .then((res) => {
                const assignedMentees = (res.data || []).filter(
                    student => student.mentorId === mentor.id
                );
                setMentees(assignedMentees);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching mentees:", err);
                setError("Failed to fetch mentees");
                setLoading(false);
            });
    }, [mentor]);

    const filteredMentees = useMemo(() => {
        return mentees.filter(mentee => 
            mentee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentee.id?.toString().includes(searchTerm)
        );
    }, [mentees, searchTerm]);

    const paginatedMentees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMentees.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMentees, currentPage]);

    const totalPages = Math.ceil(filteredMentees.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (!mentor) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Access denied. Only mentors can view this page.</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('mentorDashboard')}</h1>
                <p className={styles.subtitle}>Monitor and track your mentees' progress</p>
            </div>
            
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    {mentor.name ? mentor.name[0].toUpperCase() : 'M'}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1a365d', marginBottom: '0.25rem' }}>
                        {mentor.name || 'Mentor'}
                    </div>
                    <div className={styles.cardSubtitle}>{t('mentorId')}: {mentor.id} | {t('students')}: {filteredMentees.length}</div>
                </div>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Search students"
                />
            </div>

            {loading && <p className={styles.loading}>{t('loading')}</p>}
            {error && <div className={styles.error}>{error}</div>}
            
            {!loading && filteredMentees.length === 0 && searchTerm === "" && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👥</div>
                    <h3 className={styles.emptyTitle}>{t('noMentees')}</h3>
                    <p className={styles.emptyText}>
                        {t('noMenteesText')}
                    </p>
                </div>
            )}

            {!loading && filteredMentees.length === 0 && searchTerm !== "" && (
                <div className={styles.loading}>
                    No students found matching "{searchTerm}"
                </div>
            )}

            {!loading && paginatedMentees.length > 0 && (
                <>
                    <div className={styles.grid}>
                        {paginatedMentees.map((mentee) => (
                            <div key={mentee.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={`${styles.avatar} ${styles.avatarSmall}`}>
                                        {mentee.name ? mentee.name[0].toUpperCase() : 'S'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 className={styles.cardTitle}>{mentee.name}</h3>
                                        <div className={styles.cardSubtitle}>ID: {mentee.id}</div>
                                    </div>
                                </div>
                                <MenteeResults userId={mentee.id} />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                {t('previous')}
                            </button>
                            <span className={styles.paginationInfo}>
                                {t('page')} {currentPage} {t('of')} {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                {t('next')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function MenteeResults({ userId }) {
    const { t } = useLanguage();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`https://quiz-management-platform.onrender.com/api/quiz-attempts/user/${userId}`)
            .then((res) => {
                setResults(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching results:", err);
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <p className={styles.noResults}>{t('loading')}</p>;
    if (results.length === 0) return <p className={styles.noResults}>{t('noResults')}</p>;

    return (
        <div className={styles.resultsSection}>
            <h4 className={styles.resultsTitle}>{t('quizResults')}</h4>
            <div className={styles.resultsList}>
                {results.slice(0, 3).map((r) => {
                    const percentage = r.score / r.totalQuestions;
                    const scoreClass = percentage >= 0.7 ? 'pass' : percentage >= 0.5 ? 'warn' : 'fail';
                    
                    return (
                        <div key={r.id} className={styles.resultItem}>
                            <span className={styles.resultName}>
                                {r.quizTitle || `Quiz #${r.quizId}`}
                            </span>
                            <span className={`${styles.resultScore} ${styles[scoreClass]}`}>
                                {r.score}/{r.totalQuestions}
                            </span>
                        </div>
                    );
                })}
                {results.length > 3 && (
                    <div className={styles.moreResults}>
                        +{results.length - 3} more results
                    </div>
                )}
            </div>
        </div>
    );
}
