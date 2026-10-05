package app.service;

import app.dto.AdminStatsDto;
import app.dto.ReportCreateRequest;
import app.dto.ReportDto;
import app.entity.*;
import app.exception.ResourceNotFoundException;
import app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final BorrowingRepository borrowingRepository;
    private final DocumentRepository documentRepository;
    private final RequestRepository requestRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public ReportDto createReport(ReportCreateRequest request, User reporter) {
        User targetUser = null;
        if (request.getTargetUserId() != null) {
            targetUser = userRepository.findById(request.getTargetUserId()).orElse(null);
        }

        Report report = Report.builder()
                .reporter(reporter)
                .targetUser(targetUser)
                .reason(request.getReason().trim())
                .description(request.getDescription().trim())
                .status(ReportStatus.OPEN)
                .build();

        report = reportRepository.save(report);

        // Notify admins/moderators if needed
        return toDto(report);
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ReportDto> getReportsByReporter(Long reporterId) {
        User user = userRepository.findById(reporterId).orElse(null);
        if (user == null) return List.of();
        return reportRepository.findByReporter(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto updateReportStatus(Long id, ReportStatus status, Integer reputationPenalty) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        report.setStatus(status);
        if (status == ReportStatus.RESOLVED || status == ReportStatus.REJECTED) {
            report.setResolvedAt(LocalDateTime.now());
        }

        // If penalty specified and targetUser exists, adjust reputation
        if (status == ReportStatus.RESOLVED && report.getTargetUser() != null && reputationPenalty != null && reputationPenalty > 0) {
            userService.updateReputation(report.getTargetUser().getId(), -reputationPenalty);
            notificationService.notifyUser(
                    report.getTargetUser(),
                    "Notice of Penalty",
                    "A disciplinary report regarding your account was upheld. Reputation reduced by " + reputationPenalty + " points.",
                    "/profile"
            );
        }

        notificationService.notifyUser(
                report.getReporter(),
                "Report Update",
                "Your submitted report (Case #" + report.getId() + ") status is now: " + status.name() + ".",
                "/report"
        );

        return toDto(reportRepository.save(report));
    }

    public AdminStatsDto getAdminStatistics() {
        return AdminStatsDto.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalModerators(userRepository.countByRole(Role.MODERATOR))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .totalUsers(userRepository.count())
                .activeResources(resourceRepository.countByStatus(ResourceStatus.AVAILABLE))
                .totalResources(resourceRepository.count())
                .activeBorrowings(borrowingRepository.countByStatus(BorrowingStatus.ACTIVE))
                .totalBorrowings(borrowingRepository.count())
                .openReports(reportRepository.countByStatus(ReportStatus.OPEN))
                .totalReports(reportRepository.count())
                .totalDocuments(documentRepository.count())
                .openRequests(requestRepository.countByStatus(RequestStatus.OPEN))
                .build();
    }

    public ReportDto toDto(Report r) {
        return ReportDto.builder()
                .id(r.getId())
                .reporterId(r.getReporter().getId())
                .reporterName(r.getReporter().getName())
                .targetUserId(r.getTargetUser() != null ? r.getTargetUser().getId() : null)
                .targetUserName(r.getTargetUser() != null ? r.getTargetUser().getName() : "General/System")
                .reason(r.getReason())
                .description(r.getDescription())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .resolvedAt(r.getResolvedAt())
                .build();
    }
}
