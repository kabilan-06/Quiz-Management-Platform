// QuizForge personal learning engine.
// Everything is stored per user in localStorage, so it keeps working offline
// and alongside the Spring Boot API without any backend changes.

const LEVEL_STEPS = 500;

const LEVEL_TITLES = [
  "Rookie",
  "Apprentice",
  "Achiever",
  "Scholar",
  "Strategist",
  "Quiz Master",
  "Grandmaster",
  "Legend",
];

const STREAK_INTERVALS = [1, 3, 7, 14, 30];

export const BADGES = [
  { id: "first-quiz", label: "First Steps", icon: "🚀", hint: "Complete your first quiz" },
  { id: "five-quizzes", label: "Scholar-in-training", icon: "📚", hint: "Complete 5 quizzes" },
  { id: "ten-quizzes", label: "Assessment Regular", icon: "🎯", hint: "Complete 10 quizzes" },
  { id: "perfect-score", label: "Flawless", icon: "💯", hint: "Score 100% on any quiz" },
  { id: "high-average", label: "Consistent Pro", icon: "📈", hint: "Average 85%+ over 5 quizzes" },
  { id: "streak-3", label: "On A Roll", icon: "🔥", hint: "Show up 3 days in a row" },
  { id: "streak-7", label: "Week Streak", icon: "🏅", hint: "Show up 7 days in a row" },
  { id: "night-owl", label: "Night Owl", icon: "🦉", hint: "Finish a quiz after midnight" },
];

const STORAGE_PREFIX = "quizForge";

function dayKey(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode); the session still works.
  }
}

function userKey(userId, suffix) {
  return `${STORAGE_PREFIX}-${suffix}-${String(userId)}`;
}

export function getProgress(userId) {
  return safeRead(userKey(userId, "progress"), {
    xp: 0,
    streak: { count: 0, best: 0, lastDay: null },
    history: [],
    badges: [],
  });
}

export function levelInfo(xp) {
  const level = Math.floor(xp / LEVEL_STEPS) + 1;
  const levelFloor = (level - 1) * LEVEL_STEPS;
  const progressToNext = xp - levelFloor;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xpIntoLevel: progressToNext,
    xpForNextLevel: LEVEL_STEPS,
    percentToNext: Math.min(100, Math.round((progressToNext / LEVEL_STEPS) * 100)),
    nextTitle: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)],
  };
}

function evaluateBadges(progress, outcome) {
  const history = progress.history;
  const attempts = history.length;
  const average = attempts
    ? history.reduce((total, item) => total + item.scorePercent, 0) / attempts
    : 0;
  const earned = new Set(progress.badges);

  const checks = {
    "first-quiz": attempts >= 1,
    "five-quizzes": attempts >= 5,
    "ten-quizzes": attempts >= 10,
    "perfect-score": outcome.scorePercent === 100,
    "high-average": attempts >= 5 && average >= 85,
    "streak-3": progress.streak.count >= 3,
    "streak-7": progress.streak.count >= 7,
    "night-owl": outcome.hour < 5,
  };

  return BADGES.filter((badge) => checks[badge.id] && !earned.has(badge.id)).map((badge) => badge.id);
}

/**
 * Records a completed quiz and returns everything the UI needs to celebrate it.
 * @param {number|string} userId
 * @param {{ scorePercent: number, completedAt?: string }} outcome
 */
export function recordQuizOutcome(userId, { scorePercent, completedAt } = {}) {
  const finishDate = completedAt ? new Date(completedAt) : new Date();
  const percent = Math.max(0, Math.min(100, Math.round(Number(scorePercent) || 0)));
  const progress = getProgress(userId);
  const today = dayKey(finishDate);
  const yesterday = dayKey(new Date(finishDate.getTime() - 24 * 60 * 60 * 1000));

  let streak = progress.streak.count;
  if (progress.streak.lastDay === today) {
    // Second quiz on the same day keeps the streak as it is.
  } else if (progress.streak.lastDay === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  const xpEarned = 50 + percent;
  const beforeLevel = levelInfo(progress.xp);
  const nextXp = progress.xp + xpEarned;
  const afterLevel = levelInfo(nextXp);

  const updated = {
    ...progress,
    xp: nextXp,
    streak: {
      count: streak,
      best: Math.max(progress.streak.best ?? 0, streak),
      lastDay: today,
    },
    history: [
      ...progress.history,
      { date: finishDate.toISOString(), scorePercent: percent, xp: xpEarned },
    ],
  };

  updated.badges = [...progress.badges, ...evaluateBadges(updated, { scorePercent: percent, hour: finishDate.getHours() })];
  safeWrite(userKey(userId, "progress"), updated);

  const newBadges = updated.badges.filter((id) => !progress.badges.includes(id));

  return {
    xpEarned,
    totalXp: nextXp,
    leveledUp: afterLevel.level > beforeLevel.level,
    level: afterLevel,
    streak,
    newBadges,
    badges: updated.badges,
  };
}

// ---------------------------------------------------------------------------
// Smart review deck: every missed question becomes a flashcard that resurfaces
// on an expanding schedule until it is answered correctly several times.
// ---------------------------------------------------------------------------

export function getReviewCards(userId) {
  return safeRead(userKey(userId, "review-deck"), []);
}

export function getDueReviewCards(userId, now = new Date()) {
  return getReviewCards(userId).filter((card) => !card.due || new Date(card.due) <= now);
}

export function getMasteredReviewCount(userId) {
  return getReviewCards(userId).filter((card) => card.stage >= STREAK_INTERVALS.length).length;
}

export function addMissedQuestions(userId, { quizId, quizTitle, missed }) {
  if (!Array.isArray(missed) || missed.length === 0) return getReviewCards(userId);

  const cards = getReviewCards(userId);
  missed.forEach((item, index) => {
    const id = `${quizId}-${item.questionId ?? index}`;
    const existing = cards.find((card) => card.id === id);
    if (existing) {
      existing.due = new Date().toISOString();
      existing.stage = 0;
      return;
    }
    cards.push({
      id,
      quizId,
      quizTitle,
      questionText: item.questionText,
      correctText: item.correctText,
      stage: 0,
      due: new Date().toISOString(),
      addedAt: new Date().toISOString(),
    });
  });

  safeWrite(userKey(userId, "review-deck"), cards);
  return cards;
}

export function gradeReviewCard(userId, cardId, remembered) {
  const cards = getReviewCards(userId);
  const card = cards.find((item) => item.id === cardId);
  if (!card) return cards;

  const stage = remembered ? card.stage + 1 : 0;
  card.stage = stage;
  card.gradedAt = new Date().toISOString();
  card.due =
    stage >= STREAK_INTERVALS.length
      ? null
      : new Date(Date.now() + STREAK_INTERVALS[stage] * 24 * 60 * 60 * 1000).toISOString();

  safeWrite(userKey(userId, "review-deck"), cards);
  return cards;
}
