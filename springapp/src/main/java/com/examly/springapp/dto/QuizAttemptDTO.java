package com.examly.springapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizAttemptDTO {
    private Long id;
    private Long quizId;
    private String studentName;
    private Long userId;
    private int score;
    private int totalQuestions;
    private LocalDateTime completedAt;
    private List<AnswerDTO> answers;

    public QuizAttemptDTO() {
    }

    public QuizAttemptDTO(Long id, Long quizId, String studentName, Long userId, int score, int totalQuestions,
            LocalDateTime completedAt, List<AnswerDTO> answers) {
        this.id = id;
        this.quizId = quizId;
        this.studentName = studentName;
        this.userId = userId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.completedAt = completedAt;
        this.answers = answers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<AnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
}