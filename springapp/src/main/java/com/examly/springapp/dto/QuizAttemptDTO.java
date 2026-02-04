package com.examly.springapp.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDTO {
    private Long id;
    private Long quizId;
    private String studentName;
    private Long userId;
    private int score;
    private int totalQuestions;
    private LocalDateTime completedAt;
    private List<AnswerDTO> answers;
}