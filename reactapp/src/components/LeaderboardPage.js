import React, { useState } from "react";
import Leaderboard from "./Leaderboard";

/**
 * Leaderboard page: pick any quiz and see a live ranking from the API.
 */
export default function LeaderboardPage({ quizzes, currentUser }) {
  const [selectedId, setSelectedId] = useState(quizzes[0]?.id ?? "");

  if (!quizzes?.length) {
    return (
      <div className="empty-state">
        <span className="eyebrow">Live rankings</span>
        <h1>No quizzes yet</h1>
        <p>Once a quiz exists, its leaderboard appears here automatically.</p>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="section-heading with-action">
        <div>
          <span className="eyebrow">Live rankings</span>
          <h1>Leaderboard</h1>
          <p>Earn the top spot by scoring high, fast — ties go to the earlier submission.</p>
        </div>
        <label className="leaderboard-picker">
          Quiz
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
            ))}
          </select>
        </label>
      </div>
      <Leaderboard quizId={selectedId} currentUser={currentUser} />
    </section>
  );
}
