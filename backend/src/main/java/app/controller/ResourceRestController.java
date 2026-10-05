package app.controller;

import app.dto.ApiResponse;
import app.dto.ResourceCreateRequest;
import app.dto.ResourceDto;
import app.entity.ResourceCategory;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.ResourceService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceRestController {

    private final ResourceService resourceService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceDto>> createResource(
            @Valid @RequestBody ResourceCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        ResourceDto dto = resourceService.createResource(request, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Resource listed successfully."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceDto>>> getAllResources() {
        return ResponseEntity.ok(ApiResponse.success(resourceService.getAllAvailableResources()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDto>> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(resourceService.getResourceById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDto>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        ResourceDto dto = resourceService.updateResource(id, request, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Resource updated successfully."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        resourceService.deleteResource(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "Resource deactivated successfully."));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ResourceDto>>> searchResources(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ResourceCategory category) {
        return ResponseEntity.ok(ApiResponse.success(resourceService.searchResources(q, category)));
    }
}
