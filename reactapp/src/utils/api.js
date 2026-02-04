import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/get`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};


// Create a quiz (POST /api/quizzes/add)
export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/add`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Get quiz details for starting a quiz (GET /api/quizzes/start/:id)
export const getQuizForStart = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/start/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz for start:', error);
    throw error;
  }
};

export const addQuestion = async (quizId, questionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const getUserResults = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user results:', error);
    return [];
  }
};

export const submitQuizAttempt = async (attemptData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quiz-attempts`, attemptData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};