package com.examly.springapp.repository;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByQuiz(Quiz quiz);
    List<QuizAttempt> findByStudentName(String studentName);
    List<QuizAttempt> findByUserId(Long userId);
    Optional<Quiz> findByQuizTitleContainingIgnoreCase(String quizName);
}