package com.examly.springapp.service;

import com.examly.springapp.dto.AnswerDTO;
import com.examly.springapp.dto.QuizAttemptDTO;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Option;
import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.QuizAttempt;
import com.examly.springapp.repository.OptionRepository;
import com.examly.springapp.repository.QuizAttemptRepository;
import com.examly.springapp.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final OptionRepository optionRepository;

    public QuizAttemptService(QuizAttemptRepository quizAttemptRepository, QuizRepository quizRepository,
            OptionRepository optionRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizRepository = quizRepository;
        this.optionRepository = optionRepository;
    }

    public QuizAttemptDTO submitQuizAttempt(QuizAttemptDTO attemptDTO) {
        Quiz quiz = quizRepository.findById(attemptDTO.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        int score = calculateScore(attemptDTO);
        int totalQuestions = attemptDTO.getAnswers().size();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudentName(attemptDTO.getStudentName());
        attempt.setUserId(attemptDTO.getUserId());
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCompletedAt(LocalDateTime.now());

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        return convertToDTO(savedAttempt);
    }

    public List<QuizAttemptDTO> getQuizAttempts(Long quizId) {
        quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        return quizAttemptRepository.findByQuizId(quizId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizAttemptDTO> getAllQuizAttempts() {
        return quizAttemptRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public QuizAttemptDTO getQuizAttemptById(Long id) {
        QuizAttempt attempt = quizAttemptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + id));
        return convertToDTO(attempt);
    }

    public List<QuizAttemptDTO> getAttemptsByQuizName(String quizName) {
        Quiz quiz = quizRepository.findByTitle(quizName)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with name: " + quizName));

        return quizAttemptRepository.findByQuizId(quiz.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizAttemptDTO> getUserResults(Long userId) {
        return quizAttemptRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private int calculateScore(QuizAttemptDTO attemptDTO) {
        int score = 0;
        for (AnswerDTO answer : attemptDTO.getAnswers()) {
            Option selectedOption = optionRepository.findById(answer.getSelectedOptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Option not found"));
            if (selectedOption.isCorrect())
                score++;
        }
        return score;
    }

    private QuizAttemptDTO convertToDTO(QuizAttempt attempt) {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setId(attempt.getId());
        dto.setQuizId(attempt.getQuiz().getId());
        dto.setStudentName(attempt.getStudentName());
        dto.setUserId(attempt.getUserId());
        dto.setScore(attempt.getScore());
        dto.setTotalQuestions(attempt.getTotalQuestions());
        dto.setCompletedAt(attempt.getCompletedAt());
        return dto;
    }
}