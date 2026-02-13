import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    welcome: 'Welcome to QuizMaster Pro',
    dashboard: 'Dashboard',
    mentorDashboard: 'Mentor Dashboard',
    startQuiz: 'Start a Quiz',
    viewResults: 'View Results',
    studyFlashcards: 'Study Flashcards',
    teamQuiz: 'Team Quiz',
    logout: 'Logout',
    search: 'Search students by name or ID...',
    noMentees: 'No mentees assigned yet',
    noMenteesText: 'Students will appear here once they select you as their mentor.',
    loading: 'Loading...',
    quizResults: 'Quiz Results',
    noResults: 'No quiz results yet',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    students: 'Students',
    mentorId: 'Mentor ID'
  },
  es: {
    welcome: 'Bienvenido a QuizMaster Pro',
    dashboard: 'Panel',
    mentorDashboard: 'Panel de Mentor',
    startQuiz: 'Iniciar Cuestionario',
    viewResults: 'Ver Resultados',
    studyFlashcards: 'Estudiar Tarjetas',
    teamQuiz: 'Cuestionario en Equipo',
    logout: 'Cerrar Sesión',
    search: 'Buscar estudiantes por nombre o ID...',
    noMentees: 'No hay estudiantes asignados',
    noMenteesText: 'Los estudiantes aparecerán aquí una vez que te seleccionen como mentor.',
    loading: 'Cargando...',
    quizResults: 'Resultados del Cuestionario',
    noResults: 'No hay resultados aún',
    page: 'Página',
    of: 'de',
    previous: 'Anterior',
    next: 'Siguiente',
    students: 'Estudiantes',
    mentorId: 'ID de Mentor'
  },
  fr: {
    welcome: 'Bienvenue sur QuizMaster Pro',
    dashboard: 'Tableau de bord',
    mentorDashboard: 'Tableau de bord du mentor',
    startQuiz: 'Démarrer un quiz',
    viewResults: 'Voir les résultats',
    studyFlashcards: 'Étudier les cartes',
    teamQuiz: 'Quiz en équipe',
    logout: 'Déconnexion',
    search: 'Rechercher des étudiants par nom ou ID...',
    noMentees: 'Aucun étudiant assigné',
    noMenteesText: 'Les étudiants apparaîtront ici une fois qu\'ils vous auront sélectionné comme mentor.',
    loading: 'Chargement...',
    quizResults: 'Résultats du quiz',
    noResults: 'Aucun résultat pour le moment',
    page: 'Page',
    of: 'de',
    previous: 'Précédent',
    next: 'Suivant',
    students: 'Étudiants',
    mentorId: 'ID du mentor'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
