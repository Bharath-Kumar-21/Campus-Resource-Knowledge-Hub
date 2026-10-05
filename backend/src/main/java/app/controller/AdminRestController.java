package app.controller;

import app.dto.AdminStatsDto;
import app.dto.ApiResponse;
import app.dto.ReportDto;
import app.dto.UserDto;
import app.entity.ReportStatus;
import app.entity.Role;
import app.entity.UserStatus;
import app.service.ReportService;
import app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
@RequiredArgsConstructor
public class AdminRestController {

    private final UserService userService;
    private final ReportService reportService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserStatus(id, status), "User status updated."));
    }

    @PatchMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserRole(id, role), "User role updated."));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getAllReports() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getAllReports()));
    }

    @PatchMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<ReportDto>> updateReport(
            @PathVariable Long id,
            @RequestParam ReportStatus status,
            @RequestParam(required = false) Integer penalty) {
        return ResponseEntity.ok(ApiResponse.success(reportService.updateReportStatus(id, status, penalty), "Report updated."));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getAdminStatistics()));
    }
}
