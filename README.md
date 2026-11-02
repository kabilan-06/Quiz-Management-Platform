# Quiz Management Platform

A full-stack Quiz Management Platform built using React and Spring Boot with PostgreSQL database integration.

## Features

### Admin Features
- Create and manage quizzes
- Add, update, and delete questions
- View student performance
- Dashboard analytics
- Manage users and mentors

### Student Features
- Attend quizzes
- View scores and results
- Timer-based quiz system
- Responsive UI

### Gamified Learning Engine (unique to QuizForge)
- **XP & levels** — every finished quiz is worth XP (50 base + your score %); levels carry titles from Rookie up to Legend
- **Daily streaks** — quiz on consecutive days to build and keep a streak 🔥
- **Unlockable badges** — e.g. First Steps, Flawless, On A Roll, Week Streak, Night Owl
- **Smart Review (spaced repetition)** — every question a student misses becomes a flashcard that resurfaces on an expanding schedule (1 → 3 → 7 → 14 → 30 days) until it is mastered
- **Live leaderboards** — per-quiz rankings with medals, tie-breaking by earlier submission, and a highlight of your own row
- **Dark mode & English / Español / Français** switchers in the navbar

### Mentor Features
- Monitor student progress
- Access mentor dashboard
- Performance tracking

---

## Tech Stack

### Frontend
- React.js
- Axios
- Bootstrap / CSS
- React Router

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- REST API

### Database
- PostgreSQL

### Deployment
- Render

---

## Project Structure

```bash
Quiz-Management-Platform/
│
├── reactapp/       # Frontend React Application
├── springapp/      # Backend Spring Boot Application
└── README.md
