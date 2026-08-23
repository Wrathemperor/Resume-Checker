package com.resumechecker.services;

import com.resumechecker.dto.MatchResultDto;
import com.resumechecker.models.Candidate;
import com.resumechecker.models.JobDescription;
import com.resumechecker.models.MatchResult;
import com.resumechecker.models.Resume;
import com.resumechecker.repositories.CandidateRepository;
import com.resumechecker.repositories.JobDescriptionRepository;
import com.resumechecker.repositories.MatchResultRepository;
import com.resumechecker.repositories.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchEngineService {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final MatchResultRepository matchResultRepository;
    private final CandidateRepository candidateRepository;
    private final LlmMatchingService llmMatchingService;

    @Transactional
    public MatchResult performMatch(UUID resumeId, UUID jobId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
                
        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job Description not found"));

        if (resume.getRawText() == null || resume.getRawText().isBlank()) {
            throw new IllegalStateException("Resume raw text is empty, cannot perform match.");
        }

        log.info("Starting AI match for Resume {} and Job {}", resumeId, jobId);
        
        // 1. Call Gemini LLM for scoring
        MatchResultDto aiResult = llmMatchingService.matchResumeToJob(resume.getRawText(), job.getRawText());
        
        // 2. Fetch candidate associated with this resume
        Candidate candidate = candidateRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new IllegalStateException("No candidate found for this resume"));

        // 3. Save MatchResult
        MatchResult matchResult = new MatchResult();
        matchResult.setCandidate(candidate);
        matchResult.setJobDescription(job);
        matchResult.setScore(aiResult.score());
        matchResult.setJustification(aiResult.justification());
        matchResult.setMatchingSkills(aiResult.matchingSkills());
        matchResult.setMissingSkills(aiResult.missingSkills());
        matchResult.setStrengths(aiResult.strengths());
        matchResult.setConcerns(aiResult.concerns());
        matchResult.setShortlisted(aiResult.score() != null && aiResult.score() >= 75); // Auto shortlist threshold

        return matchResultRepository.save(matchResult);
    }
}
