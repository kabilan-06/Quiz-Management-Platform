import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const API_BASE_URL = "https://quiz-management-platform.onrender.com/api";

const MOCK_QUIZZES = [
  {
    id: 1,
    title: "Java Fundamentals",
    description: "Core Java syntax, OOP, collections, and exception handling.",
    timeLimit: 12,
    questionCount: 5,
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Spring Boot APIs",
    description: "REST controllers, services, repositories, validation, and status codes.",
    timeLimit: 15,
    questionCount: 5,
    difficulty: "Intermediate",
  },
  {
    id: 3,
    title: "React Essentials",
    description: "Components, hooks, routing, state, forms, and rendering patterns.",
    timeLimit: 10,
    questionCount: 5,
    difficulty: "Beginner",
  },
];

const MOCK_QUESTIONS = [
  {
    id: 11,
    questionText: "Which hook is used to manage local component state in React?",
    options: [
      { id: 111, optionText: "useState", correct: true },
      { id: 112, optionText: "useRoute", correct: false },
      { id: 113, optionText: "useClass", correct: false },
      { id: 114, optionText: "useRender", correct: false },
    ],
  },
  {
    id: 12,
    questionText: "Which Spring annotation marks a class as a REST controller?",
    options: [
      { id: 121, optionText: "@Service", correct: false },
      { id: 122, optionText: "@Repository", correct: false },
      { id: 123, optionText: "@RestController", correct: true },
      { id: 124, optionText: "@Entity", correct: false },
    ],
  },
  {
    id: 13,
    questionText: "What does HTTP 201 usually mean?",
    options: [
      { id: 131, optionText: "Unauthorized", correct: false },
      { id: 132, optionText: "Created", correct: true },
      { id: 133, optionText: "Bad request", correct: false },
      { id: 134, optionText: "No content", correct: false },
    ],
  },
  {
    id: 14,
    questionText: "Which Java collection stores unique values?",
    options: [
      { id: 141, optionText: "List", correct: false },
      { id: 142, optionText: "Queue", correct: false },
      { id: 143, optionText: "Set", correct: true },
      { id: 144, optionText: "ArrayList", correct: false },
    ],
  },
  {
    id: 15,
    questionText: "Which command creates an optimized React production build?",
    options: [
      { id: 151, optionText: "npm run build", correct: true },
      { id: 152, optionText: "npm run eject", correct: false },
      { id: 153, optionText: "npm test", correct: false },
      { id: 154, optionText: "npm init", correct: false },
    ],
  },
];

const MOCK_ACCOUNTS = [
  { id: 101, name: "Aarav Student", role: "USER" },
  { id: 102, name: "Diya Student", role: "USER" },
  { id: 201, name: "Dev Mentor", role: "MENTOR" },
  { id: 202, name: "Mira Mentor", role: "MENTOR" },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role);
}

function percent(score, total) {
  if (!total) return 0;
  return Math.round((Number(score) / Number(total)) * 100);
}

function normalizeQuiz(quiz, index = 0) {
  return {
    id: quiz.id ?? quiz.quizId ?? index + 1,
    title: quiz.title ?? quiz.name ?? `Quiz ${index + 1}`,
    description: quiz.description ?? "A focused quiz prepared by your learning team.",
    timeLimit: Number(quiz.timeLimit ?? quiz.duration ?? 10),
    questionCount: Number(quiz.questionCount ?? quiz.totalQuestions ?? quiz.questions?.length ?? 5),
    difficulty: quiz.difficulty ?? "Practice",
  };
}

function normalizeQuestion(question, index = 0) {
  const options = question.options?.length
    ? question.options
    : [
      { id: `${question.id}-a`, optionText: question.optionA, correct: false },
      { id: `${question.id}-b`, optionText: question.optionB, correct: false },
      { id: `${question.id}-c`, optionText: question.optionC, correct: false },
      { id: `${question.id}-d`, optionText: question.optionD, correct: false },
    ].filter((option) => option.optionText);

  return {
    id: question.id ?? question.questionId ?? index + 1,
    questionText: question.questionText ?? question.text ?? question.question ?? `Question ${index + 1}`,
    options: options.map((option, optionIndex) => ({
      id: option.id ?? option.optionId ?? `${index}-${optionIndex}`,
      optionText: option.optionText ?? option.text ?? option.value ?? `Option ${optionIndex + 1}`,
      correct: Boolean(option.correct ?? option.isCorrect),
    })),
  };
}

function useCurrentUser() {
  const [user, setUser] = useState(getStoredUser);

  const login = (nextUser) => {
    saveUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
  };

  return { user, login, logout };
}

function App() {
  const auth = useCurrentUser();
  const [quizzes, setQuizzes] = useState(MOCK_QUIZZES);

  useEffect(() => {
    let active = true;

    axios
      .get(`${API_BASE_URL}/quizzes/get`)
      .then((response) => {
        if (!active || !Array.isArray(response.data) || response.data.length === 0) return;
        setQuizzes(response.data.map(normalizeQuiz));
      })
      .catch(() => setQuizzes(MOCK_QUIZZES));

    return () => {
      active = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login auth={auth} />} />
        <Route path="/signup" element={<Signup auth={auth} />} />
        <Route
          path="/*"
          element={
            <ProtectedShell auth={auth}>
              <Routes>
                <Route path="/home" element={<Home user={auth.user} quizzes={quizzes} />} />
                <Route path="/create-quiz" element={<QuizForm onCreated={(quiz) => setQuizzes((items) => [normalizeQuiz(quiz, items.length), ...items])} />} />
                <Route path="/add-question" element={<QuestionForm quizzes={quizzes} />} />
                <Route path="/take-quiz" element={<QuizSelection quizzes={quizzes} />} />
                <Route path="/take-quiz/:quizId" element={<QuizRunner quizzes={quizzes} user={auth.user} />} />
                <Route path="/results/:quizId" element={<QuizResult />} />
                <Route path="/results" element={<Results user={auth.user} />} />
                <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                <Route path="/manage-users" element={<AdminUsers currentUser={auth.user} />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </ProtectedShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedShell({ auth, children }) {
  if (!auth.user) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      <Navbar user={auth.user} onLogout={auth.logout} />
      <main className="app-main">{children}</main>
    </div>
  );
}

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/home" aria-label="QuizForge home">
        <span className="brand-mark">QF</span>
        <span>QuizForge</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/home">Dashboard</NavLink>
        {user.role === "ADMIN" && <NavLink to="/create-quiz">Create Quiz</NavLink>}
        {user.role === "ADMIN" && <NavLink to="/add-question">Add Question</NavLink>}
        {user.role === "ADMIN" && <NavLink to="/manage-users">Manage Users</NavLink>}
        {user.role === "MENTOR" && <NavLink to="/create-quiz">Create Quiz</NavLink>}
        {user.role === "MENTOR" && <NavLink to="/add-question">Add Question</NavLink>}
        {user.role === "USER" && <NavLink to="/take-quiz">Take Quiz</NavLink>}
        {user.role === "USER" && <NavLink to="/results">Results</NavLink>}
        {user.role === "MENTOR" && <NavLink to="/mentor-dashboard">Mentor</NavLink>}
      </nav>
      <div className="user-chip">
        <span>{user.name}</span>
        <strong>{user.role}</strong>
      </div>
      <button className="button ghost" onClick={logout} type="button">
        Log out
      </button>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link className="nav-link" to={to}>
      {children}
    </Link>
  );
}

function Login({ auth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, form);
      const user = response.data?.user ?? response.data;
      auth.login({
        id: user.id ?? user.userId ?? Date.now(),
        name: user.name ?? user.username ?? form.email.split("@")[0],
        email: user.email ?? form.email,
        role: user.role ?? "USER",
      });
      navigate("/home");
    } catch {
      setError("Invalid credentials or the server is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  if (auth.user) return <Navigate to="/home" replace />;

  return (
    <main className="auth-page">
      <section className="auth-art" aria-hidden="true">
        <div className="auth-scorecard">
          <span className="eyebrow">Live assessment</span>
          <strong>91%</strong>
          <p>Class mastery trending up this week.</p>
        </div>
      </section>
      <section className="auth-panel">
        <span className="eyebrow">QuizForge Platform</span>
        <h1>Sign in to manage and attend quizzes.</h1>
        <p className="muted">A polished workspace for students, admins, and mentors.</p>
        {error && <div className="notice error">{error}</div>}
        <form className="stack" onSubmit={doLogin}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              type="email"
              required
            />
          </label>
          <label>
            Password
            <input
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter password"
              type="password"
              required
            />
          </label>
          <button className="button primary" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

function Signup({ auth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER", mentorKey: "", mentorId: "" });
  const [mentors, setMentors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.role !== "USER") {
      return;
    }

    axios
      .get(`${API_BASE_URL}/auth/mentors`)
      .then((response) => setMentors(Array.isArray(response.data) ? response.data : []))
      .catch(() => setMentors([]));
  }, [form.role]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const params = {};

      if (form.role === "MENTOR" && form.mentorKey) {
        params.mentorKey = form.mentorKey;
      }

      if (form.role === "USER" && form.mentorId) {
        params.mentorId = form.mentorId;
      }

      await axios.post(
        `${API_BASE_URL}/auth/signup`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        },
        { params }
      );

      const user = { id: Date.now(), name: form.name, email: form.email, role: form.role };
      auth.login(user);
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data || "Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page compact">
      <section className="auth-panel">
        <span className="eyebrow">Create account</span>
        <h1>Join QuizForge.</h1>
        {message && <div className="notice error">{message}</div>}
        <form className="stack" onSubmit={submit}>
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label>Email<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required /></label>
          <label>Password<input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required /></label>
          <label>
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="USER">User</option>
              <option value="MENTOR">Mentor</option>
            </select>
          </label>
          {form.role === "USER" && (
            <label>
              Choose mentor
              <select
                value={form.mentorId}
                onChange={(event) => setForm({ ...form, mentorId: event.target.value })}
              >
                <option value="">No mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {form.role === "MENTOR" && (
            <label>
              Mentor key
              <input
                value={form.mentorKey}
                onChange={(event) => setForm({ ...form, mentorKey: event.target.value })}
                placeholder="Enter mentor signup key"
                required
                type="password"
              />
            </label>
          )}
          <button className="button primary" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

function Home({ user, quizzes }) {
  const stats = [
    { label: "Available quizzes", value: quizzes.length },
    { label: "Role", value: user.role },
    { label: "Avg pass mark", value: "70%" },
  ];

  return (
    <section className="page-grid">
      <div className="hero-band">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>{user.name}</h1>
          <p>Pick up your next quiz workflow from a cleaner, role-aware dashboard.</p>
        </div>
        <RoleAction role={user.role} />
      </div>
      <div className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>Current quiz catalog</h2>
          <p>{quizzes.length} quizzes ready for assignment or practice.</p>
        </div>
        <div className="card-grid">
          {quizzes.map((quiz) => <QuizCard quiz={quiz} key={quiz.id} />)}
        </div>
      </section>
    </section>
  );
}

function RoleAction({ role }) {
  if (role === "ADMIN") return <Link className="button primary" to="/create-quiz">Create quiz</Link>;
  if (role === "MENTOR") return <Link className="button primary" to="/create-quiz">Create quiz</Link>;
  return <Link className="button primary" to="/take-quiz">Start quiz</Link>;
}

function QuizCard({ quiz, selected, onClick }) {
  return (
    <article className={`quiz-card ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="card-topline">
        <span className="pill">{quiz.difficulty}</span>
        <span>{quiz.timeLimit} min</span>
      </div>
      <h3>{quiz.title}</h3>
      <p>{quiz.description}</p>
      <div className="quiz-meta">
        <span>{quiz.questionCount} questions</span>
        <span>Pass 70%</span>
      </div>
    </article>
  );
}

function QuizSelection({ quizzes }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(quizzes[0]?.id);
  const selected = quizzes.find((quiz) => String(quiz.id) === String(selectedId));
  const filtered = quizzes.filter((quiz) => `${quiz.title} ${quiz.description}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!selectedId && quizzes[0]) setSelectedId(quizzes[0].id);
  }, [quizzes, selectedId]);

  return (
    <section className="two-column">
      <div>
        <div className="section-heading">
          <span className="eyebrow">Quiz selection</span>
          <h1>Choose your next assessment.</h1>
        </div>
        <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quizzes" />
        <div className="card-grid tight">
          {filtered.map((quiz) => (
            <QuizCard quiz={quiz} selected={String(selectedId) === String(quiz.id)} onClick={() => setSelectedId(quiz.id)} key={quiz.id} />
          ))}
        </div>
      </div>
      <aside className="summary-panel">
        <span className="eyebrow">Ready check</span>
        <h2>{selected?.title ?? "Select a quiz"}</h2>
        <p>{selected?.description ?? "Pick a quiz from the list to continue."}</p>
        <dl className="summary-list">
          <div><dt>Questions</dt><dd>{selected?.questionCount ?? 0}</dd></div>
          <div><dt>Time limit</dt><dd>{selected?.timeLimit ?? 0} minutes</dd></div>
          <div><dt>Attempts</dt><dd>Single active run</dd></div>
        </dl>
        <Link className={`button primary ${selected ? "" : "disabled"}`} to={selected ? `/take-quiz/${selected.id}` : "#"}>
          Start selected quiz
        </Link>
      </aside>
    </section>
  );
}

function QuizRunner({ quizzes, user }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((item) => String(item.id) === String(quizId)) ?? normalizeQuiz({ id: quizId, title: `Quiz ${quizId}` });
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState((quiz.timeLimit || 10) * 60);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API_BASE_URL}/quizzes/${quizId}/questions/get`)
      .then((response) => {
        if (active && Array.isArray(response.data) && response.data.length) {
          setQuestions(response.data.map(normalizeQuestion));
        }
      })
      .catch(() => setQuestions(MOCK_QUESTIONS));
    return () => {
      active = false;
    };
  }, [quizId]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      submitQuiz(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  });

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === questions.length;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const choose = (questionId, optionId) => setAnswers((value) => ({ ...value, [questionId]: optionId }));

  const submitQuiz = async (auto = false) => {
    if (submitting) return;
    if (!auto && !complete) return;
    setSubmitting(true);

    const score = questions.reduce((total, item) => {
      const selectedOption = item.options.find((option) => String(option.id) === String(answers[item.id]));
      return total + (selectedOption?.correct ? 1 : 0);
    }, 0);

    const result = {
      quizId: Number(quizId),
      quizTitle: quiz.title,
      score,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_BASE_URL}/quiz-attempts`, {
        quizId: Number(quizId),
        studentName: user.name,
        userId: user.id,
        answers: questions.map((item) => ({
          questionId: item.id,
          selectedOptionId: answers[item.id],
        })),
      });
    } catch {
      // The local result still gives the student immediate feedback.
    } finally {
      sessionStorage.setItem("latestQuizResult", JSON.stringify(result));
      navigate(`/results/${quizId}`);
    }
  };

  return (
    <section className="quiz-runner">
      <aside className="question-rail">
        <span className="eyebrow">Question map</span>
        <div className="timer">{minutes}:{seconds}</div>
        <div className="question-dots">
          {questions.map((item, index) => (
            <button
              className={`${index === current ? "active" : ""} ${answers[item.id] ? "answered" : ""}`}
              key={item.id}
              onClick={() => setCurrent(index)}
              type="button"
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="progress-track"><span style={{ width: `${percent(answeredCount, questions.length)}%` }} /></div>
        <p>{answeredCount} of {questions.length} answered</p>
      </aside>
      <article className="question-panel">
        <div className="card-topline">
          <span className="pill">{quiz.title}</span>
          <span>Question {current + 1} of {questions.length}</span>
        </div>
        <h1>{question.questionText}</h1>
        <div className="option-list">
          {question.options.map((option) => (
            <button
              className={String(answers[question.id]) === String(option.id) ? "option selected" : "option"}
              key={option.id}
              onClick={() => choose(question.id, option.id)}
              type="button"
            >
              <span>{option.optionText}</span>
            </button>
          ))}
        </div>
        <div className="runner-actions">
          <button className="button soft" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} type="button">Previous</button>
          {current < questions.length - 1 ? (
            <button className="button primary" onClick={() => setCurrent((value) => value + 1)} type="button">Next</button>
          ) : (
            <button className="button primary" disabled={!complete || submitting} onClick={() => submitQuiz(false)} type="button">
              {submitting ? "Submitting..." : "Submit quiz"}
            </button>
          )}
        </div>
      </article>
    </section>
  );
}

function QuizResult() {
  const stored = sessionStorage.getItem("latestQuizResult");
  const result = stored ? JSON.parse(stored) : { quizTitle: "Quiz", score: 4, totalQuestions: 5, completedAt: new Date().toISOString() };
  const scorePercent = percent(result.score, result.totalQuestions);
  const passed = scorePercent >= 70;

  return (
    <section className="result-layout">
      <article className="score-panel">
        <span className="eyebrow">{passed ? "Passed" : "Needs review"}</span>
        <div className="score-ring" style={{ "--score": `${scorePercent}%` }}>
          <strong>{scorePercent}%</strong>
        </div>
        <h1>{result.quizTitle}</h1>
        <p>{result.score} correct out of {result.totalQuestions} questions.</p>
        <div className="runner-actions centered">
          <Link className="button primary" to="/take-quiz">Take another quiz</Link>
          <Link className="button soft" to="/results">View all results</Link>
        </div>
      </article>
      <aside className="summary-panel">
        <span className="eyebrow">Leaderboard snippet</span>
        {["Diya", "Aarav", "You", "Meera"].map((name, index) => (
          <div className="leader-row" key={name}>
            <span>{index + 1}</span>
            <strong>{name}</strong>
            <em>{[96, 91, scorePercent, 86][index]}%</em>
          </div>
        ))}
      </aside>
    </section>
  );
}

function Results({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/quiz-attempts/user/${user.id}`)
      .then((response) => {
        if (Array.isArray(response.data)) setResults(response.data);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  const average = results.length
    ? Math.round(results.reduce((total, item) => total + percent(item.score, item.totalQuestions), 0) / results.length)
    : 0;
  const best = results.length ? Math.max(...results.map((item) => percent(item.score, item.totalQuestions))) : 0;

  const exportCsv = () => {
    const rows = [["Quiz", "Score", "Total", "Percent", "Completed"]];
    results.forEach((item) => rows.push([item.quizTitle ?? `Quiz ${item.quizId}`, item.score, item.totalQuestions, percent(item.score, item.totalQuestions), item.completedAt]));
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quiz-results.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) return <div className="loading-state">Loading results...</div>;

  return (
    <section className="section">
      <div className="section-heading with-action">
        <div>
          <span className="eyebrow">Performance</span>
          <h1>Results overview</h1>
        </div>
        <button className="button soft" onClick={exportCsv} type="button">Export CSV</button>
      </div>
      <div className="stat-grid">
        <article className="stat-card"><span>Average score</span><strong>{average}%</strong></article>
        <article className="stat-card"><span>Best score</span><strong>{best}%</strong></article>
        <article className="stat-card"><span>Total taken</span><strong>{results.length}</strong></article>
      </div>
      <div className="result-list">
        {results.length > 0 ? (
          results.map((item) => {
            const value = percent(item.score, item.totalQuestions);
            return (
              <article className="result-row" key={item.id ?? `${item.quizId}-${item.completedAt}`}>
                <div>
                  <h3>{item.quizTitle ?? `Quiz ${item.quizId}`}</h3>
                  <p>{new Date(item.completedAt ?? Date.now()).toLocaleString()}</p>
                </div>
                <div className="result-meter">
                  <span style={{ width: `${value}%` }} />
                </div>
                <strong>{value}%</strong>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <span className="eyebrow">No results yet</span>
            <p>Your quiz attempts will appear here once you complete a quiz.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MentorDashboard() {
  const [query, setQuery] = useState("");
  const students = [];
  const classAverage = 0;

  return (
    <section className="two-column mentor-layout">
      <aside className="summary-panel mentor-card">
        <span className="eyebrow">Mentor workspace</span>
        <h1>Class pulse</h1>
        <div className="stat-card embedded"><span>Class average</span><strong>{classAverage}%</strong></div>
        <p>Review student performance and quickly identify who needs support.</p>
      </aside>
      <div>
        <div className="section-heading">
          <h1>Student grid</h1>
          <p>{students.length} learners in view.</p>
        </div>
        <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students or tracks" />
        <div className="student-grid">
          {students.length > 0 ? (
            students.map((student) => {
              const avg = Math.round(student.scores.reduce((total, score) => total + score, 0) / student.scores.length);
              return (
                <article className="student-card" key={student.name}>
                  <div>
                    <h3>{student.name}</h3>
                    <p>{student.track}</p>
                  </div>
                  <span className={`badge ${avg >= 85 ? "good" : avg >= 70 ? "warn" : "risk"}`}>{avg}%</span>
                  <div className="mini-bars">
                    {student.scores.map((score, index) => <span key={index} style={{ height: `${score}%` }} />)}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              <span className="eyebrow">No students yet</span>
              <p>Student performance will appear here once mentor assignments are available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminUsers({ currentUser }) {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (currentUser.role !== "ADMIN") return;

    axios
      .get(`${API_BASE_URL}/auth/users`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAccounts(response.data.filter((account) => account.role !== "ADMIN"));
        }
      })
      .catch(() => setAccounts(MOCK_ACCOUNTS));
  }, [currentUser.role]);

  if (currentUser.role !== "ADMIN") {
    return <AccessDenied message="Only administrators can manage users." />;
  }

  const filteredAccounts = accounts.filter((account) =>
    `${account.name} ${account.role}`.toLowerCase().includes(query.toLowerCase())
  );

  const deleteAccount = async (account) => {
    setMessage("");
    setDeletingId(account.id);

    try {
      await axios.delete(`${API_BASE_URL}/auth/users/${account.id}`, {
        params: { requesterRole: currentUser.role },
      });
      setAccounts((items) => items.filter((item) => item.id !== account.id));
      setMessage(`${account.name} was deleted.`);
    } catch (error) {
      if (String(account.id).length >= 13) {
        setAccounts((items) => items.filter((item) => item.id !== account.id));
        setMessage(`${account.name} was removed from the local list.`);
      } else {
        setMessage(error.response?.data || "Unable to delete this account.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="section">
      <div className="section-heading with-action">
        <div>
          <span className="eyebrow">Admin control</span>
          <h1>Manage users and mentors</h1>
          <p>Remove non-admin accounts from the platform.</p>
        </div>
        <Link className="button soft" to="/create-quiz">Create quiz</Link>
      </div>
      {message && <div className={message.includes("Unable") ? "notice error" : "notice success"}>{message}</div>}
      <input
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search users or mentors"
      />
      <div className="account-list">
        {filteredAccounts.map((account) => (
          <article className="account-row" key={account.id}>
            <div>
              <h3>{account.name}</h3>
              <p>Account ID {account.id}</p>
            </div>
            <span className={`badge ${account.role === "MENTOR" ? "warn" : "good"}`}>{account.role}</span>
            <button
              className="button danger"
              disabled={deletingId === account.id}
              onClick={() => deleteAccount(account)}
              type="button"
            >
              {deletingId === account.id ? "Deleting..." : "Delete"}
            </button>
          </article>
        ))}
        {filteredAccounts.length === 0 && (
          <div className="empty-state">
            <span className="eyebrow">No accounts</span>
            <p>No users or mentors match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function QuizForm({ onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", timeLimit: 10 });
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("role");

  if (!["ADMIN", "MENTOR"].includes(role)) {
    return <AccessDenied message="Only administrators and mentors can create quizzes." />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${API_BASE_URL}/quizzes/add`, form);
      onCreated(response.data ?? form);
      setMessage("Quiz created successfully.");
      setForm({ title: "", description: "", timeLimit: 10 });
    } catch {
      const localQuiz = { ...form, id: Date.now(), questionCount: 0, difficulty: "Draft" };
      onCreated(localQuiz);
      setMessage("Saved locally because the API did not respond.");
    }
  };

  return (
    <FormShell title="Create quiz" subtitle="Build a clean quiz shell before adding questions.">
      {message && <div className="notice success">{message}</div>}
      <form className="form-grid" onSubmit={submit}>
        <label>Quiz title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" /></label>
        <label>Time limit<input min="1" max="180" type="number" value={form.timeLimit} onChange={(event) => setForm({ ...form, timeLimit: event.target.value })} /></label>
        <div className="runner-actions">
          <button className="button primary" type="submit">Create quiz</button>
          <button className="button soft" onClick={() => navigate("/add-question")} type="button">Add questions</button>
        </div>
      </form>
    </FormShell>
  );
}

function QuestionForm({ quizzes }) {
  const [form, setForm] = useState({ quizId: quizzes[0]?.id ?? "", questionText: "" });
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!form.quizId && quizzes[0]) setForm((value) => ({ ...value, quizId: quizzes[0].id }));
  }, [quizzes, form.quizId]);

  if (!["ADMIN", "MENTOR"].includes(role)) {
    return <AccessDenied message="Only administrators and mentors can add questions." />;
  }

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      questionText: form.questionText,
      questionType: "MULTIPLE_CHOICE",
      options: options.map((optionText, index) => ({ optionText, correct: index === correctIndex })),
    };

    try {
      await axios.post(`${API_BASE_URL}/quizzes/${form.quizId}/questions`, payload);
      setMessage("Question added successfully.");
    } catch {
      setMessage("Question staged locally because the API did not respond.");
    }

    setForm((value) => ({ ...value, questionText: "" }));
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
  };

  return (
    <FormShell title="Add question" subtitle="Use clear options and mark exactly one correct answer.">
      {message && <div className="notice success">{message}</div>}
      <form className="form-grid" onSubmit={submit}>
        <label>
          Select quiz
          <select value={form.quizId} onChange={(event) => setForm({ ...form, quizId: event.target.value })}>
            {quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>{quiz.title}</option>)}
          </select>
        </label>
        <label>Question<input value={form.questionText} onChange={(event) => setForm({ ...form, questionText: event.target.value })} required /></label>
        <div className="option-editor">
          {options.map((option, index) => (
            <label className={correctIndex === index ? "answer-option correct" : "answer-option"} key={index}>
              <input type="radio" checked={correctIndex === index} onChange={() => setCorrectIndex(index)} />
              <span>{String.fromCharCode(65 + index)}</span>
              <input value={option} onChange={(event) => setOptions(options.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))} placeholder={`Option ${index + 1}`} required />
            </label>
          ))}
        </div>
        <button className="button primary" type="submit">Add question</button>
      </form>
    </FormShell>
  );
}

function FormShell({ title, subtitle, children }) {
  return (
    <section className="form-shell">
      <div className="section-heading">
        <span className="eyebrow">Quiz tools</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function AccessDenied({ message }) {
  return (
    <section className="empty-state">
      <span className="eyebrow">Access denied</span>
      <h1>Admin area</h1>
      <p>{message}</p>
      <Link className="button primary" to="/home">Back to dashboard</Link>
    </section>
  );
}

export default App;
