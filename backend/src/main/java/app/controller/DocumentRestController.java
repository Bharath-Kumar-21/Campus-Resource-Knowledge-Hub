package app.controller;

import app.dto.ApiResponse;
import app.dto.DocumentDto;
import app.entity.Document;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.DocumentService;
import app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentRestController {

    private final DocumentService documentService;
    private final UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "metadata", required = false) String metadata,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        DocumentDto dto = documentService.uploadDocument(file, title, tags, metadata, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Private academic document stored in Knowledge Vault."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getMyDocuments(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getUserDocuments(userPrincipal.getId())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> searchDocuments(
            @RequestParam(value = "q", required = false) String query,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(documentService.searchUserDocuments(userPrincipal.getId(), query)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocumentById(id, user)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        Document doc = documentService.getDocumentEntity(id, user);

        File file = new File(doc.getFileUri());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        documentService.deleteDocument(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "Document deleted successfully."));
    }
}
