package app.controller;

import app.dto.ApiResponse;
import app.dto.ReportCreateRequest;
import app.dto.ReportDto;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.ReportService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportRestController {

    private final ReportService reportService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportDto>> createReport(
            @Valid @RequestBody ReportCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        ReportDto dto = reportService.createReport(request, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Report submitted for moderation review."));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getMyReports(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getReportsByReporter(userPrincipal.getId())));
    }
}
