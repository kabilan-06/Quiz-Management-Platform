package com.examly.springapp.dto;

import java.time.LocalDateTime;
import java.util.List;

import java.time.LocalDateTime;
import java.util.List;

public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private int timeLimit;
    private LocalDateTime createdAt;
    private List<QuestionDTO> questions;
    private List<QuizAttemptDTO> attempts;

    public QuizDTO() {
    }

    public QuizDTO(Long id, String title, String description, int timeLimit, LocalDateTime createdAt,
            List<QuestionDTO> questions, List<QuizAttemptDTO> attempts) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.timeLimit = timeLimit;
        this.createdAt = createdAt;
        this.questions = questions;
        this.attempts = attempts;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(int timeLimit) {
        this.timeLimit = timeLimit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }

    public List<QuizAttemptDTO> getAttempts() {
        return attempts;
    }

    public void setAttempts(List<QuizAttemptDTO> attempts) {
        this.attempts = attempts;
    }
}