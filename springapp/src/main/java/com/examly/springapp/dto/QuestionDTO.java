package com.examly.springapp.dto;

import java.util.List;

public class QuestionDTO {
    private Long id;
    private String questionText;
    private String questionType;
    private List<OptionDTO> options;

    public QuestionDTO() {
    }

    public QuestionDTO(Long id, String questionText, String questionType, List<OptionDTO> options) {
        this.id = id;
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public List<OptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDTO> options) {
        this.options = options;
    }
}