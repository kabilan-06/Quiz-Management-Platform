package com.examly.springapp.dto;

public class AnswerDTO {
    private Long questionId;
    private Long selectedOptionId;
    private boolean correct;

    public AnswerDTO() {
    }

    public AnswerDTO(Long questionId, Long selectedOptionId, boolean correct) {
        this.questionId = questionId;
        this.selectedOptionId = selectedOptionId;
        this.correct = correct;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}