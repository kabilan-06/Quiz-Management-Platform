import {
  BADGES,
  addMissedQuestions,
  getDueReviewCards,
  getMasteredReviewCount,
  getProgress,
  getReviewCards,
  gradeReviewCard,
  levelInfo,
  recordQuizOutcome,
} from "../utils/progress";

const USER = 9001;

const flushStorage = () => {
  window.localStorage.clear();
};

describe("progress engine", () => {
  beforeEach(() => {
    flushStorage();
  });

  test("starts with a clean progress record", () => {
    const progress = getProgress(USER);
    expect(progress.xp).toBe(0);
    expect(progress.history).toEqual([]);
    expect(progress.badges).toEqual([]);
  });

  test("awards XP, first-quiz badge and a 1-day streak", () => {
    const bonus = recordQuizOutcome(USER, { scorePercent: 80 });

    expect(bonus.xpEarned).toBe(50 + 80);
    expect(bonus.streak).toBe(1);
    expect(bonus.level.level).toBe(1);
    expect(bonus.newBadges).toContain("first-quiz");
    expect(bonus.newBadges).not.toContain("perfect-score");
  });

  test("extends the streak across consecutive days and resets after a gap", () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    recordQuizOutcome(USER, { scorePercent: 60 });

    // Backdate the stored streak to yesterday, then record another quiz today.
    const backdated = getProgress(USER);
    backdated.streak = { count: 1, best: 1, lastDay: yesterday.toISOString().slice(0, 10) };
    window.localStorage.setItem(
      `quizForge-progress-${USER}`,
      JSON.stringify(backdated)
    );

    const bonus = recordQuizOutcome(USER, { scorePercent: 70 });
    expect(bonus.streak).toBe(2);

    // A day further back breaks the streak
    const longAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const gapless = getProgress(USER);
    gapless.streak = { count: 3, best: 3, lastDay: longAgo };
    window.localStorage.setItem(
      `quizForge-progress-${USER}`,
      JSON.stringify(gapless)
    );

    expect(recordQuizOutcome(USER, { scorePercent: 50 }).streak).toBe(1);
  });

  test("levelInfo scales with XP boundaries", () => {
    expect(levelInfo(0).level).toBe(1);
    expect(levelInfo(499).level).toBe(1);
    expect(levelInfo(500).level).toBe(2);
    expect(levelInfo(1234).level).toBe(3);
    expect(levelInfo(1234).percentToNext).toBeGreaterThan(0);
  });

  test("missed questions become due review cards and can be graded through the schedule", () => {
    addMissedQuestions(USER, {
      quizId: 3,
      quizTitle: "React Essentials",
      missed: [
        { questionId: 11, questionText: "Which hook manages state?", correctText: "useState" },
      ],
    });

    let cards = getReviewCards(USER);
    expect(cards).toHaveLength(1);
    expect(cards[0].correctText).toBe("useState");
    expect(getDueReviewCards(USER)).toHaveLength(1);

    const cardId = cards[0].id;
    gradeReviewCard(USER, cardId, true);
    cards = getReviewCards(USER);

    expect(cards[0].stage).toBe(1);
    expect(new Date(cards[0].due).getTime()).toBeGreaterThan(Date.now());
    expect(getDueReviewCards(USER)).toHaveLength(0);

    gradeReviewCard(USER, cardId, false);
    cards = getReviewCards(USER);
    expect(cards[0].stage).toBe(0);
    // Forgetting reschedules the card, roughly one day out — not immediately due.
    expect(getDueReviewCards(USER)).toHaveLength(0);
    expect(new Date(cards[0].due).getTime()).toBeGreaterThan(Date.now());
    expect(getMasteredReviewCount(USER)).toBe(0);
  });

  test("re-adding a missed question resets its schedule", () => {
    addMissedQuestions(USER, {
      quizId: 3,
      quizTitle: "React Essentials",
      missed: [{ questionId: 11, questionText: "Q?", correctText: "A" }],
    });
    gradeReviewCard(USER, "3-11", true);
    expect(getReviewCards(USER)[0].stage).toBe(1);

    addMissedQuestions(USER, {
      quizId: 3,
      quizTitle: "React Essentials",
      missed: [{ questionId: 11, questionText: "Q?", correctText: "A" }],
    });

    expect(getReviewCards(USER)).toHaveLength(1);
    expect(getReviewCards(USER)[0].stage).toBe(0);
    expect(getDueReviewCards(USER)).toHaveLength(1);
  });

  test("every declared badge has a stable id and label", () => {
    expect(new Set(BADGES.map((badge) => badge.id)).size).toBe(BADGES.length);
    BADGES.forEach((badge) => {
      expect(badge.label.trim()).not.toBe("");
      expect(badge.hint.trim()).not.toBe("");
    });
  });
});
