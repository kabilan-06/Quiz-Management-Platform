import React, { useState } from "react";

const sampleFlashcards = [
    { front: "What is the capital of France?", back: "Paris" },
    { front: "2 + 2 = ?", back: "4" },
    { front: "React is a ___ library?", back: "JavaScript" },
];

export default function Flashcards({ cards = sampleFlashcards }) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => setFlipped(f => !f);
    const handleNext = () => { setIndex(i => (i + 1) % cards.length); setFlipped(false); };
    const handlePrev = () => { setIndex(i => (i - 1 + cards.length) % cards.length); setFlipped(false); };

    if (!cards.length) return <p>No flashcards available.</p>;

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
            <div
                onClick={handleFlip}
                style={{
                    minHeight: 120,
                    background: "#f8fafc",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px #e0e7ef",
                    padding: 32,
                    fontSize: 22,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 16,
                    userSelect: "none"
                }}
            >
                {flipped ? cards[index].back : cards[index].front}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                <button onClick={handlePrev} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}>Prev</button>
                <button onClick={handleNext} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}>Next</button>
            </div>
            <div style={{ marginTop: 8, color: '#888' }}>Card {index + 1} of {cards.length}</div>
        </div>
    );
}
