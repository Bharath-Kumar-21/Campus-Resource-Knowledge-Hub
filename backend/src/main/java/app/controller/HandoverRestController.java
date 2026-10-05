package app.controller;

import app.dto.ApiResponse;
import app.dto.QrHandoverDto;
import app.dto.QrVerifyRequest;
import app.entity.HandoverType;
import app.entity.User;
import app.security.UserPrincipal;
import app.service.HandoverService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/handovers")
@RequiredArgsConstructor
public class HandoverRestController {

    private final HandoverService handoverService;
    private final UserService userService;

    @PostMapping("/{borrowingId}/qr")
    public ResponseEntity<ApiResponse<QrHandoverDto>> generateQr(
            @PathVariable Long borrowingId,
            @RequestParam(defaultValue = "PICKUP") HandoverType type,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        QrHandoverDto dto = handoverService.generateQrToken(borrowingId, type, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Secure QR code generated for " + type));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<QrHandoverDto>> verifyQr(
            @Valid @RequestBody QrVerifyRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.getUserById(userPrincipal.getId());
        QrHandoverDto dto = handoverService.verifyQrToken(request.getQrToken(), user);
        return ResponseEntity.ok(ApiResponse.success(dto, "QR code verified successfully! Handover complete."));
    }
}
