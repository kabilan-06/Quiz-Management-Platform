package com.kabilan.assessment.repository;

import com.kabilan.assessment.model.Quiz;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByTitle(String title);
}

