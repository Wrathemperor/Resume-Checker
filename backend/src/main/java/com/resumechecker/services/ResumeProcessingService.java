package com.resumechecker.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumechecker.dto.ParsedResumeDto;
import com.resumechecker.models.*;
import com.resumechecker.repositories.CandidateRepository;
import com.resumechecker.repositories.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeProcessingService {

    private final LlmExtractionService llmExtractionService;
    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;
    private final ObjectMapper objectMapper;

    @Async
    @Transactional
    public void processResumeAsync(Resume resume) {
        try {
            log.info("Starting background processing for resume: {}", resume.getFilename());
            
            // 1. Update status
            resume.setParseStatus("processing");
            resumeRepository.save(resume);

            // 2. Call LLM for structured extraction
            ParsedResumeDto dto = llmExtractionService.extractResumeData(resume.getRawText());

            // 3. Save raw JSON back to resume for caching/debugging
            Map<String, Object> jsonMap = objectMapper.convertValue(dto, Map.class);
            resume.setParsedJson(jsonMap);
            resume.setParseStatus("completed");
            resumeRepository.save(resume);

            // 4. Map DTO to JPA Entities
            Candidate candidate = new Candidate();
            candidate.setResume(resume);
            candidate.setName(dto.name());
            candidate.setEmail(dto.email());
            candidate.setPhone(dto.phone());
            candidate.setSummary(dto.summary());

            if (dto.skills() != null) {
                candidate.setSkills(dto.skills().stream().map(s -> {
                    Skill skill = new Skill();
                    skill.setCandidate(candidate);
                    skill.setSkillName(s.skillName());
                    skill.setProficiency(s.proficiency());
                    skill.setYearsExp(s.yearsExp());
                    return skill;
                }).collect(Collectors.toList()));
            }

            if (dto.experiences() != null) {
                candidate.setExperiences(dto.experiences().stream().map(e -> {
                    Experience exp = new Experience();
                    exp.setCandidate(candidate);
                    exp.setCompany(e.company());
                    exp.setRole(e.role());
                    exp.setStartDate(e.startDate());
                    exp.setEndDate(e.endDate());
                    exp.setDescription(e.description());
                    return exp;
                }).collect(Collectors.toList()));
            }

            if (dto.educations() != null) {
                candidate.setEducations(dto.educations().stream().map(e -> {
                    Education edu = new Education();
                    edu.setCandidate(candidate);
                    edu.setInstitution(e.institution());
                    edu.setDegree(e.degree());
                    edu.setField(e.field());
                    edu.setGraduationYear(e.graduationYear());
                    return edu;
                }).collect(Collectors.toList()));
            }

            // 5. Save candidate (cascades to skills, exp, edu)
            candidateRepository.save(candidate);
            
            log.info("Successfully processed and saved candidate: {}", candidate.getName());

        } catch (Exception e) {
            log.error("Failed to process resume: {}", resume.getId(), e);
            resume.setParseStatus("failed");
            resumeRepository.save(resume);
        }
    }
}
