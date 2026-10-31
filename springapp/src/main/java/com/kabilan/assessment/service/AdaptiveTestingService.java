package com.kabilan.assessment.service;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * AI-Adaptive Testing Service implementing the 3-Parameter Logistic (3PL)
 * Item Response Theory (IRT) model.
 *
 * Mathematically adapts question difficulty in real time based on:
 * 1. User current skill ability (Theta: -3.0 to +3.0)
 * 2. Item discrimination parameter (a: 0.5 to 2.5)
 * 3. Item difficulty parameter (b: -3.0 to +3.0)
 * 4. Pseudo-guessing parameter (c: ~0.20 to 0.25)
 * 5. Latency penalty / speed-accuracy weighting
 */
@Service
public class AdaptiveTestingService {

    private static final double DEFAULT_INITIAL_THETA = 0.0; // Average proficiency
    private static final double MIN_THETA = -3.5;
    private static final double MAX_THETA = 3.5;
    private static final double LEARNING_RATE = 0.55; // Step-size for Newton-Raphson approximation
    private static final double DEFAULT_GUESSING_PROB = 0.25;

    public record ItemParameters(
            Long id,
            String questionText,
            double discrimination, // a-parameter
            double difficulty,     // b-parameter
            double guessing        // c-parameter
    ) {}

    public record ResponseTelemetry(
            boolean isCorrect,
            long latencyMs,
            long expectedTimeMs
    ) {}

    public record AbilityAssessment(
            double currentTheta,
            double standardError,
            int questionsAnswered,
            String proficiencyBand
    ) {}

    /**
     * Calculates the 3-Parameter Logistic probability P(Theta) that a candidate
     * with skill level theta answers an item with parameters (a, b, c) correctly.
     *
     * Formula: P(θ) = c + (1 - c) / (1 + e^(-1.702 * a * (θ - b)))
     */
    public double calculateProbability(double theta, ItemParameters item) {
        double a = item.discrimination();
        double b = item.difficulty();
        double c = item.guessing() > 0 ? item.guessing() : DEFAULT_GUESSING_PROB;

        double exponent = -1.702 * a * (theta - b);
        double logistic = 1.0 / (1.0 + Math.exp(exponent));
        return c + (1.0 - c) * logistic;
    }

    /**
     * Calculates Fisher Information I(Theta) for an item at ability level Theta.
     * High information means this question provides maximum diagnostic certainty.
     *
     * Formula: I(θ) = (1.702 * a)^2 * ((P(θ) - c)^2 / (1 - c)^2) * ((1 - P(θ)) / P(θ))
     */
    public double calculateFisherInformation(double theta, ItemParameters item) {
        double p = calculateProbability(theta, item);
        double a = item.discrimination();
        double c = item.guessing() > 0 ? item.guessing() : DEFAULT_GUESSING_PROB;

        if (p <= c || p >= 1.0) {
            return 0.001;
        }

        double numerator = Math.pow(1.702 * a, 2) * Math.pow(p - c, 2) * (1.0 - p);
        double denominator = Math.pow(1.0 - c, 2) * p;
        return numerator / denominator;
    }

    /**
     * Updates candidate ability (Theta) based on the observed answer and latency metrics.
     * Applies speed-weighted scoring: fast correct answers elevate theta faster;
     * fast wrong answers penalize guessing; slow correct answers indicate marginal mastery.
     */
    public double recalibrateAbility(double currentTheta, ItemParameters item, ResponseTelemetry telemetry) {
        double predictedProb = calculateProbability(currentTheta, item);
        double actualScore = telemetry.isCorrect() ? 1.0 : 0.0;
        double errorDelta = actualScore - predictedProb;

        // Speed weighting ratio (latency vs target expected time)
        double speedRatio = (double) telemetry.latencyMs() / Math.max(1000, telemetry.expectedTimeMs());
        double speedWeight = 1.0;

        if (telemetry.isCorrect()) {
            // Faster than expected gives a slight confidence bonus; exceedingly slow gives partial credit
            speedWeight = speedRatio < 0.7 ? 1.25 : (speedRatio > 1.5 ? 0.85 : 1.0);
        } else {
            // Instant wrong response (< 25% of expected time) indicates blind guessing
            speedWeight = speedRatio < 0.25 ? 1.35 : 1.0;
        }

        double deltaTheta = LEARNING_RATE * item.discrimination() * errorDelta * speedWeight;
        double updatedTheta = currentTheta + deltaTheta;

        // Clamp theta within boundaries [-3.5, +3.5]
        return Math.max(MIN_THETA, Math.min(MAX_THETA, updatedTheta));
    }

    /**
     * Selects the next optimal question from the available pool that maximizes
     * Fisher Information at the candidate's current ability level.
     */
    public Optional<ItemParameters> selectOptimalQuestion(double currentTheta, List<ItemParameters> availableQuestions) {
        if (availableQuestions == null || availableQuestions.isEmpty()) {
            return Optional.empty();
        }

        return availableQuestions.stream()
                .max(Comparator.comparingDouble(q -> calculateFisherInformation(currentTheta, q)));
    }

    /**
     * Computes the candidate's final proficiency assessment and confidence score.
     */
    public AbilityAssessment computeAssessment(double currentTheta, List<Double> cumulativeInformation, int totalQuestions) {
        double totalInfo = cumulativeInformation.stream().mapToDouble(Double::doubleValue).sum();
        double standardError = totalInfo > 0 ? 1.0 / Math.sqrt(totalInfo) : 1.0;

        String band;
        if (currentTheta >= 2.0) {
            band = "Expert / Principal Candidate (Top 2%)";
        } else if (currentTheta >= 1.0) {
            band = "Advanced / Senior Candidate";
        } else if (currentTheta >= 0.0) {
            band = "Proficient / Mid-Level Candidate";
        } else if (currentTheta >= -1.0) {
            band = "Developing / Junior Candidate";
        } else {
            band = "Foundational / Needs Remediation";
        }

        return new AbilityAssessment(
                Math.round(currentTheta * 100.0) / 100.0,
                Math.round(standardError * 100.0) / 100.0,
                totalQuestions,
                band
        );
    }
}
