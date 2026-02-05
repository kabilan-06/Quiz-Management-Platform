package com.examly.springapp.controller;

import com.examly.springapp.dto.QuestionDTO;
import com.examly.springapp.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    public QuestionController() {
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> addQuestionToQuiz(
            @PathVariable Long quizId,
            @RequestBody QuestionDTO questionDTO) {
        QuestionDTO createdQuestion = questionService.addQuestionToQuiz(quizId, questionDTO);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getQuestionsForQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getQuestionsForQuiz(quizId));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long quizId, @PathVariable Long questionId) {
        return ResponseEntity.ok(questionService.getQuestionById(quizId, questionId));
    }
}