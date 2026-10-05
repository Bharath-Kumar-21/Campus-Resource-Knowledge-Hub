package app.controller;

import app.dto.*;
import app.entity.*;
import app.security.UserPrincipal;
import app.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WebController {

    private final UserService userService;
    private final ResourceService resourceService;
    private final RequestService requestService;
    private final MatchingService matchingService;
    private final BorrowingService borrowingService;
    private final HandoverService handoverService;
    private final DocumentService documentService;
    private final ReportService reportService;
    private final NotificationService notificationService;

    // Helper to add common user details to model
    private void populateUser(Model model, UserPrincipal principal) {
        if (principal != null) {
            User user = userService.getUserById(principal.getId());
            model.addAttribute("currentUser", user);
            model.addAttribute("unreadNotifications", notificationService.getUnreadCount(user.getId()));
        }
    }

    @GetMapping("/")
    public String index(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("totalResources", resourceService.getAllAvailableResources().size());
        model.addAttribute("recentResources", resourceService.getAllAvailableResources().stream().limit(4).toList());
        return "index";
    }

    @GetMapping("/login")
    public String loginPage(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) return "redirect:/dashboard";
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) return "redirect:/dashboard";
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        User user = userService.getUserById(principal.getId());

        List<BorrowingDto> activeBorrowings = borrowingService.getBorrowingsByBorrower(user.getId()).stream()
                .filter(b -> b.getStatus() == BorrowingStatus.ACTIVE || b.getStatus() == BorrowingStatus.APPROVED)
                .toList();

        List<RequestDto> myRequests = requestService.getRequestsByRequester(user.getId());
        List<ResourceDto> myResources = resourceService.getResourcesByOwner(user.getId());
        List<DocumentDto> myDocs = documentService.getUserDocuments(user.getId());

        model.addAttribute("activeBorrowings", activeBorrowings);
        model.addAttribute("myRequests", myRequests);
        model.addAttribute("myResources", myResources);
        model.addAttribute("myDocs", myDocs);
        model.addAttribute("availableResources", resourceService.getAllAvailableResources().stream().limit(6).toList());
        model.addAttribute("notifications", notificationService.getNotificationsForUser(user.getId()).stream().limit(5).toList());

        return "dashboard";
    }

    @GetMapping("/resources")
    public String resources(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ResourceCategory category,
            Model model,
            @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("resources", resourceService.searchResources(q, category));
        model.addAttribute("query", q);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("categories", ResourceCategory.values());
        return "resources";
    }

    @GetMapping("/resources/new")
    public String newResourceForm(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("categories", ResourceCategory.values());
        return "create-resource";
    }

    @PostMapping("/resources/new")
    public String createResourceSubmit(
            @ModelAttribute ResourceCreateRequest request,
            @RequestParam(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        resourceService.createResource(request, imageFile, user);
        return "redirect:/resources?created=true";
    }

    @GetMapping("/resources/{id}")
    public String resourceDetails(@PathVariable Long id, Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        ResourceDto resource = resourceService.getResourceById(id);
        model.addAttribute("resource", resource);
        model.addAttribute("isOwner", principal != null && resource.getOwnerId().equals(principal.getId()));
        return "resource-details";
    }

    @GetMapping("/resources/{id}/edit")
    public String editResourceForm(@PathVariable Long id, Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        ResourceDto resource = resourceService.getResourceById(id);
        model.addAttribute("resource", resource);
        model.addAttribute("categories", ResourceCategory.values());
        return "edit-resource";
    }

    @PostMapping("/resources/{id}/edit")
    public String updateResourceSubmit(
            @PathVariable Long id,
            @ModelAttribute ResourceCreateRequest request,
            @RequestParam(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        resourceService.updateResource(id, request, imageFile, user);
        return "redirect:/resources/" + id + "?updated=true";
    }

    @PostMapping("/resources/{id}/delete")
    public String deleteResourceSubmit(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        resourceService.deleteResource(id, user);
        return "redirect:/resources?deleted=true";
    }

    @GetMapping("/requests")
    public String requests(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("requests", requestService.getAllOpenRequests());
        model.addAttribute("myRequests", requestService.getRequestsByRequester(principal.getId()));
        model.addAttribute("categories", ResourceCategory.values());
        return "requests";
    }

    @PostMapping("/requests/new")
    public String createRequestSubmit(
            @ModelAttribute RequestCreateDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        RequestDto created = requestService.createRequest(dto, user);
        return "redirect:/matches/" + created.getId();
    }

    @GetMapping("/matches/{requestId}")
    public String viewMatches(@PathVariable Long requestId, Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        RequestDto request = requestService.getRequestById(requestId);
        List<MatchResultDto> matches = matchingService.findMatchesForRequest(requestId);
        model.addAttribute("request", request);
        model.addAttribute("matches", matches);
        return "matches";
    }

    @GetMapping("/borrowings")
    public String borrowings(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        User user = userService.getUserById(principal.getId());
        model.addAttribute("myBorrowings", borrowingService.getBorrowingsByBorrower(user.getId()));
        model.addAttribute("incomingRequests", borrowingService.getBorrowingsByOwner(user.getId()));
        return "borrowings";
    }

    @PostMapping("/borrowings/create")
    public String requestBorrowing(
            @ModelAttribute BorrowingCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        borrowingService.createBorrowingRequest(request, user);
        return "redirect:/borrowings?requested=true";
    }

    @PostMapping("/borrowings/{id}/approve")
    public String approveBorrowing(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        borrowingService.approveBorrowing(id, user);
        return "redirect:/borrowings?approved=true";
    }

    @PostMapping("/borrowings/{id}/decline")
    public String declineBorrowing(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        borrowingService.declineBorrowing(id, user);
        return "redirect:/borrowings?declined=true";
    }

    @PostMapping("/borrowings/{id}/return")
    public String returnBorrowing(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        borrowingService.markAsReturned(id, user);
        return "redirect:/borrowings?returned=true";
    }

    @GetMapping("/handover/{borrowingId}")
    public String handoverPage(
            @PathVariable Long borrowingId,
            @RequestParam(defaultValue = "PICKUP") HandoverType type,
            Model model,
            @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        User user = userService.getUserById(principal.getId());
        BorrowingDto borrowing = borrowingService.getBorrowingById(borrowingId);
        QrHandoverDto handover = handoverService.generateQrToken(borrowingId, type, user);

        model.addAttribute("borrowing", borrowing);
        model.addAttribute("handover", handover);
        model.addAttribute("handoverType", type);
        return "handover";
    }

    @PostMapping("/handover/verify")
    public String verifyHandover(
            @RequestParam String qrToken,
            Model model,
            @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        User user = userService.getUserById(principal.getId());
        QrHandoverDto result = handoverService.verifyQrToken(qrToken, user);
        return "redirect:/borrowings?verified=true";
    }

    @GetMapping("/knowledge-vault")
    public String knowledgeVault(
            @RequestParam(value = "q", required = false) String query,
            Model model,
            @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        List<DocumentDto> documents = documentService.searchUserDocuments(principal.getId(), query);
        model.addAttribute("documents", documents);
        model.addAttribute("query", query);
        return "knowledge-vault";
    }

    @PostMapping("/knowledge-vault/upload")
    public String uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "metadata", required = false) String metadata,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        documentService.uploadDocument(file, title, tags, metadata, user);
        return "redirect:/knowledge-vault?uploaded=true";
    }

    @PostMapping("/knowledge-vault/{id}/delete")
    public String deleteDocument(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        documentService.deleteDocument(id, user);
        return "redirect:/knowledge-vault?deleted=true";
    }

    @GetMapping("/notifications")
    public String notifications(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("notifications", notificationService.getNotificationsForUser(principal.getId()));
        notificationService.markAllAsRead(principal.getId());
        return "notifications";
    }

    @GetMapping("/profile")
    public String profile(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        User user = userService.getUserById(principal.getId());
        model.addAttribute("user", user);
        model.addAttribute("borrowings", borrowingService.getBorrowingsByBorrower(user.getId()));
        model.addAttribute("resources", resourceService.getResourcesByOwner(user.getId()));
        return "profile";
    }

    @GetMapping("/report")
    public String reportPage(
            @RequestParam(required = false) Long targetUserId,
            Model model,
            @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("targetUserId", targetUserId);
        model.addAttribute("myReports", reportService.getReportsByReporter(principal.getId()));
        return "report";
    }

    @PostMapping("/report/submit")
    public String submitReport(
            @ModelAttribute ReportCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        reportService.createReport(request, user);
        return "redirect:/report?submitted=true";
    }

    @GetMapping("/admin")
    public String adminDashboard(Model model, @AuthenticationPrincipal UserPrincipal principal) {
        populateUser(model, principal);
        model.addAttribute("stats", reportService.getAdminStatistics());
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("reports", reportService.getAllReports());
        model.addAttribute("resources", resourceService.getAllAvailableResources());
        model.addAttribute("borrowings", borrowingService.getAllBorrowings());
        return "admin";
    }

    @PostMapping("/admin/users/{id}/status")
    public String updateStatusAdmin(@PathVariable Long id, @RequestParam UserStatus status) {
        userService.updateUserStatus(id, status);
        return "redirect:/admin?updated=user";
    }

    @PostMapping("/admin/users/{id}/role")
    public String updateRoleAdmin(@PathVariable Long id, @RequestParam Role role) {
        userService.updateUserRole(id, role);
        return "redirect:/admin?updated=user";
    }

    @PostMapping("/admin/reports/{id}")
    public String resolveReportAdmin(
            @PathVariable Long id,
            @RequestParam ReportStatus status,
            @RequestParam(required = false) Integer penalty) {
        reportService.updateReportStatus(id, status, penalty);
        return "redirect:/admin?updated=report";
    }
}
