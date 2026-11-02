package com.kabilan.assessment.repository;

import com.kabilan.assessment.model.Question;
import com.kabilan.assessment.model.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuiz(Quiz quiz);
}   
