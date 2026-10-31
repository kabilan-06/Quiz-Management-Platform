package com.kabilan.assessment.service;

import com.kabilan.assessment.dto.QuizDTO;
import com.kabilan.assessment.exception.ResourceNotFoundException;
import com.kabilan.assessment.model.Quiz;
import com.kabilan.assessment.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;

    public QuizDTO createQuiz(QuizDTO quizDTO) {
        System.out.println("Creating quiz with title: " + quizDTO.getTitle());
        
        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setTimeLimit(quizDTO.getTimeLimit());
        quiz.setCreatedAt(LocalDateTime.now());

        Quiz savedQuiz = quizRepository.save(quiz);
        System.out.println("Quiz saved with ID: " + savedQuiz.getId());
        
        return convertToDTO(savedQuiz);
    }

    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return convertToDTO(quiz);
    }

    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setCreatedAt(quiz.getCreatedAt());
        return dto;
    }
}
