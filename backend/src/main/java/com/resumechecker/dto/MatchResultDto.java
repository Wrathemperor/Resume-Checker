package com.resumechecker.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MatchResultDto(
        Integer score,
        String justification,
        List<String> matchingSkills,
        List<String> missingSkills,
        List<String> strengths,
        List<String> concerns
) {}
