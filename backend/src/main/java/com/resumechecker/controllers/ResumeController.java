package com.resumechecker.controllers;

import com.resumechecker.models.Resume;
import com.resumechecker.repositories.ResumeRepository;
import com.resumechecker.services.FileStorageService;
import com.resumechecker.services.PdfParserService;
import com.resumechecker.services.ResumeProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows the Vite frontend to talk to this API
public class ResumeController {

    private final FileStorageService fileStorageService;
    private final PdfParserService pdfParserService;
    private final ResumeProcessingService resumeProcessingService;
    private final ResumeRepository resumeRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Save file locally
            Path savedPath = fileStorageService.saveFile(file);

            // 2. Extract text synchronously (PDFBox is very fast)
            String rawText = pdfParserService.extractText(savedPath);

            // 3. Create the initial Resume record in DB
            Resume resume = new Resume();
            resume.setFilename(file.getOriginalFilename());
            resume.setFilePath(savedPath.toString());
            resume.setRawText(rawText);
            resume.setParseStatus("pending");
            
            Resume savedResume = resumeRepository.save(resume);

            // 4. Trigger Async LLM Processing in the background
            resumeProcessingService.processResumeAsync(savedResume);

            // 5. Return immediately so the user isn't waiting on the LLM
            return ResponseEntity.accepted().body(Map.of(
                    "message", "Resume uploaded successfully and is being processed by AI.",
                    "resumeId", savedResume.getId(),
                    "status", "pending"
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Upload failed",
                    "details", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable UUID id) {
        return resumeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable UUID id) {
        if (!resumeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            resumeRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Deletion failed. Record may be tied to existing match results.",
                    "details", e.getMessage()
            ));
        }
    }
}
