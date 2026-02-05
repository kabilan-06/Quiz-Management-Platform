package com.examly.springapp;

import com.examly.springapp.dto.*;
// import com.examly.springapp.model.*; // (Unused)
import com.examly.springapp.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

// import java.util.*; // (Unused)

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class QuizManagementSystemApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    // @Autowired
    // private ObjectMapper objectMapper; // (Unused)

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;

        // Clean up database before each test
        quizAttemptRepository.deleteAll();
        optionRepository.deleteAll();
        questionRepository.deleteAll();
        quizRepository.deleteAll();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
    // All test methods removed as requested.

    // Test 1: Create Quiz Successfully
    @Test
    @Order(1)
    public void testCreateQuiz_Success() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setTitle("Java Fundamentals");
        quizDTO.setDescription("Test your Java knowledge");
        quizDTO.setTimeLimit(60);

        HttpEntity<QuizDTO> request = new HttpEntity<>(quizDTO, createHeaders());

        ResponseEntity<QuizDTO> response = restTemplate.postForEntity(
                baseUrl + "/api/quizzes", request, QuizDTO.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        QuizDTO body = response.getBody();
        assertNotNull(body);
        assertEquals("Java Fundamentals", body.getTitle());
        assertEquals("Test your Java knowledge", body.getDescription());
        assertEquals(60, body.getTimeLimit());
        assertNotNull(body.getId());
        assertNotNull(body.getCreatedAt());
    }

    // Test 2: Create Quiz with Validation Errors
    @Test
    @Order(2)
    public void testCreateQuiz_ValidationError() {
        QuizDTO invalidQuiz = new QuizDTO();
        invalidQuiz.setTitle("AB"); // Too short
        invalidQuiz.setTimeLimit(200); // Too high

        HttpEntity<QuizDTO> request = new HttpEntity<>(invalidQuiz, createHeaders());

        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
                baseUrl + "/api/quizzes", request, ErrorResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        ErrorResponse errBody = response.getBody();
        assertNotNull(errBody);
        assertEquals(400, errBody.getStatus());
        assertTrue(errBody.getErrors().size() > 0);
    }

    // Test 3: Get All Quizzes
    @Test
    @Order(3)
    public void testGetAllQuizzes_Success() {
        // Create test quizzes
    }
}