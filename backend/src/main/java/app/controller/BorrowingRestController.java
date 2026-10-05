package app.controller;

import app.dto.ApiResponse;
import app.dto.BorrowingCreateRequest;
import app.dto.BorrowingDto;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.BorrowingService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowingRestController {

    private final BorrowingService borrowingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<BorrowingDto>> createBorrowing(
            @Valid @RequestBody BorrowingCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        BorrowingDto dto = borrowingService.createBorrowingRequest(request, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Borrowing request submitted to owner."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BorrowingDto>>> getMyBorrowings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(borrowingService.getBorrowingsByBorrower(userPrincipal.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BorrowingDto>> getBorrowingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(borrowingService.getBorrowingById(id)));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<BorrowingDto>> approveBorrowing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        BorrowingDto dto = borrowingService.approveBorrowing(id, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Borrowing request approved."));
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<BorrowingDto>> declineBorrowing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        BorrowingDto dto = borrowingService.declineBorrowing(id, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Borrowing request declined."));
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<ApiResponse<BorrowingDto>> returnBorrowing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        BorrowingDto dto = borrowingService.markAsReturned(id, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Borrowing marked as returned successfully."));
    }
}
