import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  getDueReviewCards,
  getMasteredReviewCount,
  getReviewCards,
  gradeReviewCard,
} from "../utils/progress";

const INTERVAL_LABELS = ["1 day", "3 days", "7 days", "2 weeks", "1 month"];

/**
 * Smart Review — a spaced-repetition deck built from the questions the student
 * actually missed. Cards come back on an expanding schedule (1 → 3 → 7 → 14 →
 * 30 days) and are retired once they are remembered on every interval.
 */
export default function ReviewDeck({ user }) {
  const userId = user.id;
  const [dueCards, setDueCards] = useState(() => getDueReviewCards(userId));
  const [flipped, setFlipped] = useState(false);
  const [gradedToday, setGradedToday] = useState(0);

  const allCards = getReviewCards(userId);
  const mastered = getMasteredReviewCount(userId);

  if (!user) return null;

  const grade = (remembered) => {
    if (!dueCards.length) return;
    gradeReviewCard(userId, dueCards[0].id, remembered);
    setDueCards(getDueReviewCards(userId));
    setFlipped(false);
    setGradedToday((count) => count + 1);
  };

  const card = dueCards[0];

  return (
    <section className="section review-layout">
      <div className="section-heading with-action">
        <div>
          <span className="eyebrow">Smart review</span>
          <h1>Beat your missed questions.</h1>
          <p>
            Cards come back 1, 3, 7, 14 and 30 days later — spaced repetition, tuned
            to what you actually got wrong.
          </p>
        </div>
        <div className="review-counters">
          <span className="badge">{dueCards.length} due</span>
          <span className="badge good">{mastered} mastered</span>
        </div>
      </div>

      {allCards.length === 0 ? (
        <div className="empty-state">
          <span className="eyebrow">No review deck yet</span>
          <h2>Your mistakes become flashcards</h2>
          <p>
            Take a quiz and every question you miss is turned into a review card
            automatically. Come back tomorrow for round one.
          </p>
          <Link className="button primary" to="/take-quiz">Take a quiz</Link>
        </div>
      ) : dueCards.length === 0 ? (
        <div className="empty-state">
          <span className="eyebrow">All caught up</span>
          <h2>Nothing is due right now.</h2>
          <p>
            You have reviewed {gradedToday} card{gradedToday === 1 ? "" : "s"} today.
            {mastered > 0 ? ` ${mastered} card${mastered === 1 ? " is" : "s are"} fully mastered.` : ""}
            The rest of your deck returns over the coming days.
          </p>
          <Link className="button soft" to="/home">Back to dashboard</Link>
        </div>
      ) : (
        <article className="review-card">
          <div className="card-topline">
            <span className="pill">{card.quizTitle}</span>
            <span>
              Card {dueCards.length} left · next gap {INTERVAL_LABELS[Math.min(card.stage, INTERVAL_LABELS.length - 1)]}
            </span>
          </div>
          <button
            className={`review-stage ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((value) => !value)}
            type="button"
            aria-label={flipped ? "Hide answer" : "Reveal answer"}
          >
            <span className="review-question">{card.questionText}</span>
            <span className="review-answer" hidden={!flipped}>{card.correctText}</span>
            <em className="review-hint">{flipped ? "Tap to hide" : "Tap to reveal the answer"}</em>
          </button>
          <div className="runner-actions centered">
            {flipped ? (
              <>
                <button className="button ghost" onClick={() => grade(false)} type="button">
                  Still shaky · 1 day
                </button>
                <button className="button primary" onClick={() => grade(true)} type="button">
                  Got it ✓
                </button>
              </>
            ) : (
              <p className="muted">Try to recall it, then flip.</p>
            )}
          </div>
          {card.stage > 0 && (
            <p className="muted review-stage-note">
              Remembered {card.stage} of {INTERVAL_LABELS.length} times in a row — keeps coming back until it is mastered.
            </p>
          )}
        </article>
      )}

      {allCards.length > 0 && (
        <section className="review-list">
          <h2>Full deck</h2>
          {allCards.map((item, index) => (
            <article className="review-row" key={item.id}>
              <div>
                <h3>{item.questionText}</h3>
                <p>{item.quizTitle}</p>
              </div>
              <span className={`badge ${item.stage >= INTERVAL_LABELS.length ? "good" : item.stage > 0 ? "warn" : "risk"}`}>
                {item.stage >= INTERVAL_LABELS.length ? "Mastered" : item.stage > 0 ? `Round ${item.stage + 1}` : "New"}
              </span>
              <span aria-hidden="true">{index === 0 && "▶"}</span>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
