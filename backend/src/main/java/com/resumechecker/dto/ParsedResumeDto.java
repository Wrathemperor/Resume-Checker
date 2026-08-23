package com.resumechecker.dto;

import java.math.BigDecimal;
import java.util.List;

public record ParsedResumeDto(
    String name,
    String email,
    String phone,
    String summary,
    List<SkillDto> skills,
    List<ExperienceDto> experiences,
    List<EducationDto> educations
) {
    public record SkillDto(
        String skillName, 
        String proficiency, 
        BigDecimal yearsExp
    ) {}

    public record ExperienceDto(
        String company, 
        String role, 
        String startDate, 
        String endDate, 
        String description
    ) {}

    public record EducationDto(
        String institution, 
        String degree, 
        String field, 
        Integer graduationYear
    ) {}
}
