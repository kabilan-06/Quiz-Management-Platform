package com.examly.springapp.controller;

import com.examly.springapp.dto.QuizDTO;
import com.examly.springapp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {
    private final QuizService quizService;

    // POST /api/quizzes/add (alias for createQuiz)
    @PostMapping("/add")
    public ResponseEntity<?> addQuiz(@RequestBody QuizDTO quizDTO) {
        try {
            QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating quiz: " + e.getMessage());
        }
    }

    // POST /api/quizzes/create (alias for createQuiz)
    @PostMapping("/create")
    public ResponseEntity<?> createQuizAlias(@RequestBody QuizDTO quizDTO) {
        try {
            QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating quiz: " + e.getMessage());
        }
    }

    // GET /api/quizzes/start/{id} (returns quiz details for starting a quiz)
    @GetMapping("/start/{id}")
    public ResponseEntity<QuizDTO> startQuiz(@PathVariable Long id) {
        QuizDTO quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody QuizDTO quizDTO) {
        try {
            System.out.println("Received quiz creation request: " + quizDTO.getTitle());
            QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating quiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating quiz: " + e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        QuizDTO quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("Database connection working!");
    }
}