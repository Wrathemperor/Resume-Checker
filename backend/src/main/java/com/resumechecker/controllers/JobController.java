package com.resumechecker.controllers;

import com.resumechecker.dto.JobDescriptionRequestDto;
import com.resumechecker.models.JobDescription;
import com.resumechecker.models.MatchResult;
import com.resumechecker.repositories.JobDescriptionRepository;
import com.resumechecker.repositories.MatchResultRepository;
import com.resumechecker.services.MatchEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final MatchEngineService matchEngineService;
    private final MatchResultRepository matchResultRepository;

    @PostMapping
    public ResponseEntity<JobDescription> createJob(@RequestBody JobDescriptionRequestDto request) {
        JobDescription job = new JobDescription();
        job.setTitle(request.title());
        job.setRawText(request.rawText());
        return ResponseEntity.ok(jobDescriptionRepository.save(job));
    }

    @GetMapping
    public ResponseEntity<List<JobDescription>> getAllJobs() {
        return ResponseEntity.ok(jobDescriptionRepository.findAll());
    }

    @PostMapping("/{jobId}/match/{resumeId}")
    public ResponseEntity<MatchResult> matchResumeToJob(@PathVariable UUID jobId, @PathVariable UUID resumeId) {
        MatchResult result = matchEngineService.performMatch(resumeId, jobId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{jobId}/matches")
    public ResponseEntity<List<MatchResult>> getMatchesForJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(matchResultRepository.findByJobDescriptionId(jobId));
    }
}
