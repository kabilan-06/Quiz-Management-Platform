package com.examly.springapp.repository;

import com.examly.springapp.model.Quiz;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByTitle(String title);
}

