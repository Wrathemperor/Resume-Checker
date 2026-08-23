package com.resumechecker.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumechecker.dto.MatchResultDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class LlmMatchingService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    @Value("${LLM_MODEL:gemini-2.0-flash}")
    private String model;

    private static final String SYSTEM_PROMPT = """
        You are an expert technical recruiter and AI matching engine.
        Your task is to evaluate a candidate's resume against a job description.
        
        Provide a detailed JSON evaluation with the following structure:
        {
          "score": 0-10 (integer representing overall fit),
          "justification": "Detailed explanation of why this score was given, highlighting key alignments and gaps",
          "matchingSkills": ["Skill 1", "Skill 2"],
          "missingSkills": ["Missing 1", "Missing 2"],
          "strengths": ["Strength 1", "Strength 2"],
          "concerns": ["Concern 1", "Concern 2"]
        }
        
        Ensure your response is valid JSON and contains NO markdown blocks or other text.
        """;

    public LlmMatchingService(RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
        this.restClient = restClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
        this.objectMapper = objectMapper;
    }

    @SuppressWarnings("unchecked")
    public MatchResultDto matchResumeToJob(String resumeText, String jobDescriptionText) {
        String fullPrompt = SYSTEM_PROMPT + 
                "\n\n--- JOB DESCRIPTION ---\n" + jobDescriptionText + 
                "\n\n--- CANDIDATE RESUME ---\n" + resumeText;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", fullPrompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "responseMimeType", "application/json"
                )
        );

        log.debug("Calling Gemini API for matching with model: {}", model);

        Map<String, Object> response = restClient.post()
                .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        String jsonText = extractJsonFromGeminiResponse(response);
        log.debug("Gemini match result JSON: {}", jsonText);

        try {
            return objectMapper.readValue(jsonText, MatchResultDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini matching response", e);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractJsonFromGeminiResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            throw new RuntimeException("Unexpected Gemini API response structure: " + response, e);
        }
    }
}
