package com.examly.springapp.service;

import com.examly.springapp.dto.*;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final OptionRepository optionRepository;

    public QuestionDTO addQuestionToQuiz(Long quizId, QuestionDTO questionDTO) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        
        validateQuestionOptions(questionDTO);

        Question question = new Question();
        question.setQuestionText(questionDTO.getQuestionText());
        question.setQuestionType(questionDTO.getQuestionType());
        question.setQuiz(quiz);

        Question savedQuestion = questionRepository.save(question);
        List<Option> options = saveQuestionOptions(questionDTO, savedQuestion);
        
        return convertToDTO(savedQuestion, options);
    }

    private void validateQuestionOptions(QuestionDTO questionDTO) {
        if ("MULTIPLE_CHOICE".equals(questionDTO.getQuestionType())) {
            long correctCount = questionDTO.getOptions().stream()
                    .filter(OptionDTO::isCorrect)
                    .count();
            
            if (correctCount != 1) {
                throw new IllegalArgumentException("Each question must have exactly one correct option");
            }
        }
    }

    private List<Option> saveQuestionOptions(QuestionDTO questionDTO, Question question) {
        return questionDTO.getOptions().stream()
                .map(optionDTO -> createOption(optionDTO, question))
                .collect(Collectors.toList());
    }

    private Option createOption(OptionDTO optionDTO, Question question) {
        Option option = new Option();
        option.setOptionText(optionDTO.getOptionText());
        option.setCorrect(optionDTO.isCorrect());
        option.setQuestion(question);
        return optionRepository.save(option);
    }

    private QuestionDTO convertToDTO(Question question, List<Option> options) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setOptions(convertOptionsToDTOs(options));
        return dto;
    }
   
    private List<OptionDTO> convertOptionsToDTOs(List<Option> options) {
        return options.stream()
                .map(this::convertOptionToDTO)
                .collect(Collectors.toList());
    }
   
    private OptionDTO convertOptionToDTO(Option option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setOptionText(option.getOptionText());
        dto.setCorrect(option.isCorrect());
        return dto;
    }

    public List<QuestionDTO> getQuestionsForQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        List<Question> questions = questionRepository.findByQuiz(quiz);
        return questions.stream()
            .map(q -> convertToDTO(q, q.getOptions()))
            .collect(Collectors.toList());
    }

    public QuestionDTO getQuestionById(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!question.getQuiz().getId().equals(quiz.getId())) {
            throw new ResourceNotFoundException("Question does not belong to this quiz");
        }
        return convertToDTO(question, question.getOptions());
    }
}