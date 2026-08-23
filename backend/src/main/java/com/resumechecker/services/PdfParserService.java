package com.resumechecker.services;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.nio.file.Path;

@Service
public class PdfParserService {

    public String extractText(Path filePath) {
        // PDFBox 3.x API: use Loader.loadPDF() instead of PDDocument.load()
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse PDF document: " + filePath.getFileName(), e);
        }
    }
}
