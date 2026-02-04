package com.examly.springapp.controller;

import com.examly.springapp.dto.QuizAttemptDTO;
import com.examly.springapp.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class QuizAttemptController {
    private final QuizAttemptService quizAttemptService;

    @PostMapping
    public ResponseEntity<QuizAttemptDTO> submitQuizAttempt(
            @Valid @RequestBody QuizAttemptDTO attemptDTO) {
        QuizAttemptDTO createdAttempt = quizAttemptService.submitQuizAttempt(attemptDTO);
        return new ResponseEntity<>(createdAttempt, HttpStatus.CREATED);
    }

    @GetMapping("/quizzes/{quizId}/attempts")
    public ResponseEntity<List<QuizAttemptDTO>> getQuizAttempts(
            @PathVariable Long quizId) {
        List<QuizAttemptDTO> attempts = quizAttemptService.getQuizAttempts(quizId);
        return ResponseEntity.ok(attempts);
    }
    @GetMapping
    public ResponseEntity<List<QuizAttemptDTO>> getAllQuizAttempts() {
        List<QuizAttemptDTO> attempts = quizAttemptService.getAllQuizAttempts();
        return ResponseEntity.ok(attempts);
    }
    // GET /api/quiz-attempts/{id}
@GetMapping("/{id}")
public ResponseEntity<QuizAttemptDTO> getQuizAttemptById(@PathVariable Long id) {
    QuizAttemptDTO attempt = quizAttemptService.getQuizAttemptById(id);
    return ResponseEntity.ok(attempt);
}

    @GetMapping("/by-quiz-name/{quizName}")
    public ResponseEntity<List<QuizAttemptDTO>> getAttemptsByQuizName(@PathVariable String quizName) {
        List<QuizAttemptDTO> attempts = quizAttemptService.getAttemptsByQuizName(quizName);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizAttemptDTO>> getUserResults(@PathVariable Long userId) {
        List<QuizAttemptDTO> attempts = quizAttemptService.getUserResults(userId);
        return ResponseEntity.ok(attempts);
    }

}