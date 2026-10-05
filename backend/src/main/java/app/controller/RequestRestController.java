package app.controller;

import app.dto.ApiResponse;
import app.dto.MatchResultDto;
import app.dto.RequestCreateDto;
import app.dto.RequestDto;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.MatchingService;
import app.service.RequestService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestRestController {

    private final RequestService requestService;
    private final MatchingService matchingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<RequestDto>> createRequest(
            @Valid @RequestBody RequestCreateDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        RequestDto created = requestService.createRequest(dto, user);
        return ResponseEntity.ok(ApiResponse.success(created, "Resource request published successfully."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RequestDto>>> getAllRequests() {
        return ResponseEntity.ok(ApiResponse.success(requestService.getAllOpenRequests()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestDto>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(requestService.getRequestById(id)));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<ApiResponse<List<MatchResultDto>>> getMatchesForRequest(@PathVariable Long id) {
        List<MatchResultDto> matches = matchingService.findMatchesForRequest(id);
        return ResponseEntity.ok(ApiResponse.success(matches, "Found " + matches.size() + " ranked match(es)."));
    }
}
