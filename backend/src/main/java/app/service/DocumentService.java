package app.service;

import app.dto.DocumentDto;
import app.entity.Document;
import app.entity.User;
import app.exception.InvalidRequestException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Value("${app.upload.dir:uploads/documents}")
    private String uploadDir;

    @Transactional
    public DocumentDto uploadDocument(MultipartFile file, String title, String tags, String metadata, User user) {
        if (file.isEmpty()) {
            throw new InvalidRequestException("Cannot upload an empty file.");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.txt";
        String extension = getFileExtension(originalFilename).toLowerCase();

        // Allowed types: PDF, DOC, DOCX, TXT, MD, Images (png, jpg, jpeg, webp)
        List<String> allowedExtensions = List.of("pdf", "doc", "docx", "txt", "md", "markdown", "png", "jpg", "jpeg", "webp");
        if (!allowedExtensions.contains(extension)) {
            throw new InvalidRequestException("Unsupported file type ." + extension + ". Allowed: PDF, DOC, DOCX, TXT, MD, PNG, JPG.");
        }

        try {
            Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            String storedFilename = UUID.randomUUID() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            Path targetLocation = targetDir.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Simple text extraction for TXT, MD, or text metadata
            String extractedText = "";
            if (extension.equals("txt") || extension.equals("md") || extension.equals("markdown")) {
                try {
                    byte[] bytes = file.getBytes();
                    extractedText = new String(bytes, StandardCharsets.UTF_8);
                    if (extractedText.length() > 5000) {
                        extractedText = extractedText.substring(0, 5000);
                    }
                } catch (Exception ignored) {}
            } else {
                extractedText = title + " " + (tags != null ? tags : "") + " " + (metadata != null ? metadata : "") + " [" + extension.toUpperCase() + "]";
            }

            Document doc = Document.builder()
                    .owner(user)
                    .title(title != null && !title.isBlank() ? title.trim() : originalFilename)
                    .fileName(originalFilename)
                    .fileUri(targetLocation.toString())
                    .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .metadata(metadata)
                    .tags(tags)
                    .textContent(extractedText)
                    .build();

            return toDto(documentRepository.save(doc));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public List<DocumentDto> getUserDocuments(Long userId) {
        return documentRepository.findByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> searchUserDocuments(Long userId, String query) {
        if (query == null || query.trim().isEmpty()) {
            return getUserDocuments(userId);
        }
        return documentRepository.searchUserDocuments(userId, query.trim()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Document getDocumentEntity(Long id, User currentUser) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        // Strict Object-Level Privacy Isolation:
        // A student must NEVER be able to access another student's private documents!
        if (!doc.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Access denied: You do not own this private academic document.");
        }

        return doc;
    }

    public DocumentDto getDocumentById(Long id, User currentUser) {
        return toDto(getDocumentEntity(id, currentUser));
    }

    @Transactional
    public void deleteDocument(Long id, User currentUser) {
        Document doc = getDocumentEntity(id, currentUser);
        try {
            Files.deleteIfExists(Paths.get(doc.getFileUri()));
        } catch (Exception ignored) {}
        documentRepository.delete(doc);
    }

    private String getFileExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(dot + 1) : "";
    }

    public DocumentDto toDto(Document d) {
        String preview = d.getTextContent();
        if (preview != null && preview.length() > 200) {
            preview = preview.substring(0, 200) + "...";
        }
        return DocumentDto.builder()
                .id(d.getId())
                .ownerId(d.getOwner().getId())
                .title(d.getTitle())
                .fileName(d.getFileName())
                .fileUri(d.getFileUri())
                .contentType(d.getContentType())
                .metadata(d.getMetadata())
                .tags(d.getTags())
                .previewText(preview)
                .createdAt(d.getCreatedAt())
                .build();
    }
}
