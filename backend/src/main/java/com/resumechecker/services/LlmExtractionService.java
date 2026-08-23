package com.resumechecker.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumechecker.dto.ParsedResumeDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class LlmExtractionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    @Value("${LLM_MODEL:gemini-2.0-flash}")
    private String model;

    // System prompt that instructs Gemini to return structured JSON
    private static final String SYSTEM_PROMPT = """
        You are an expert HR data extraction AI.
        Extract the candidate's information from the resume text provided by the user.
        Return ONLY a valid JSON object with this exact structure — no markdown, no code fences, just raw JSON:
        {
          "name": "string or null",
          "email": "string or null",
          "phone": "string or null",
          "summary": "string or null",
          "skills": [
            { "skillName": "string", "proficiency": "beginner|intermediate|advanced|expert or null", "yearsExp": number or null }
          ],
          "experiences": [
            { "company": "string or null", "role": "string or null", "startDate": "string or null", "endDate": "string or null", "description": "string or null" }
          ],
          "educations": [
            { "institution": "string or null", "degree": "string or null", "field": "string or null", "graduationYear": number or null }
          ]
        }
        If a field is not found in the resume, use null.
        """;

    public LlmExtractionService(RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
        this.restClient = restClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
        this.objectMapper = objectMapper;
    }

    @SuppressWarnings("unchecked")
    public ParsedResumeDto extractResumeData(String rawText) {
        String fullPrompt = SYSTEM_PROMPT + "\n\nResume:\n" + rawText;

        // Build Gemini native API request body
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", fullPrompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "responseMimeType", "application/json"  // Forces Gemini to return clean JSON
                )
        );

        log.debug("Calling Gemini API with model: {}", model);

        // Call native Gemini API — key goes as query param, not in Authorization header
        Map<String, Object> response = restClient.post()
                .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        // Extract the text content from Gemini's response envelope
        String jsonText = extractJsonFromGeminiResponse(response);
        log.debug("Gemini extracted JSON: {}", jsonText);

        try {
            return objectMapper.readValue(jsonText, ParsedResumeDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini JSON response into ParsedResumeDto", e);
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
