package app.service;

import app.dto.QrHandoverDto;
import app.entity.*;
import app.exception.InvalidQrTokenException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.repository.BorrowingRepository;
import app.repository.HandoverRepository;
import app.repository.ResourceRepository;
import app.util.QrCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HandoverService {

    private final HandoverRepository handoverRepository;
    private final BorrowingRepository borrowingRepository;
    private final ResourceRepository resourceRepository;
    private final QrCodeGenerator qrCodeGenerator;
    private final NotificationService notificationService;
    private final UserService userService;

    @Value("${app.qr.expiration-minutes:30}")
    private int qrExpirationMinutes;

    @Transactional
    public QrHandoverDto generateQrToken(Long borrowingId, HandoverType type, User user) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id: " + borrowingId));

        boolean isBorrower = borrowing.getBorrower().getId().equals(user.getId());
        boolean isOwner = borrowing.getResource().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ADMIN") || user.getRole().name().equals("MODERATOR");

        if (!isBorrower && !isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to generate QR for this borrowing.");
        }

        // Reuse unexpired unverified handover if already exists
        Optional<Handover> existing = handoverRepository.findFirstByBorrowingIdAndTypeOrderByExpiresAtDesc(borrowingId, type);
        Handover handover;
        if (existing.isPresent() && existing.get().getVerifiedAt() == null && existing.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            handover = existing.get();
        } else {
            String token = "CRKH-" + type.name() + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
            handover = Handover.builder()
                    .borrowing(borrowing)
                    .qrToken(token)
                    .type(type)
                    .expiresAt(LocalDateTime.now().plusMinutes(qrExpirationMinutes))
                    .build();
            handover = handoverRepository.save(handover);
        }

        String qrImage = qrCodeGenerator.generateQrCodeBase64(handover.getQrToken(), 260, 260);

        return toDto(handover, qrImage);
    }

    @Transactional
    public QrHandoverDto verifyQrToken(String token, User verifier) {
        Handover handover = handoverRepository.findByQrToken(token.trim())
                .orElseThrow(() -> new InvalidQrTokenException("Invalid QR code token."));

        if (handover.getVerifiedAt() != null) {
            throw new InvalidQrTokenException("This QR token has already been verified and cannot be reused.");
        }

        if (handover.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidQrTokenException("This QR token has expired. Please request a new QR code.");
        }

        Borrowing borrowing = handover.getBorrowing();
        Resource resource = borrowing.getResource();

        handover.setVerifiedAt(LocalDateTime.now());
        handover = handoverRepository.save(handover);

        if (handover.getType() == HandoverType.PICKUP) {
            borrowing.setStatus(BorrowingStatus.ACTIVE);
            resource.setStatus(ResourceStatus.BORROWED);
            borrowingRepository.save(borrowing);
            resourceRepository.save(resource);

            notificationService.notifyUser(
                    borrowing.getBorrower(),
                    "Pickup Confirmed!",
                    "You have successfully picked up '" + resource.getTitle() + "'. Return deadline: " + borrowing.getEndDate() + ".",
                    "/borrowings"
            );
            notificationService.notifyUser(
                    resource.getOwner(),
                    "Handover Verified!",
                    borrowing.getBorrower().getName() + " has completed pickup of '" + resource.getTitle() + "'.",
                    "/borrowings"
            );
        } else if (handover.getType() == HandoverType.RETURN) {
            borrowing.setStatus(BorrowingStatus.RETURNED);
            borrowing.setReturnedAt(LocalDateTime.now());
            resource.setStatus(ResourceStatus.AVAILABLE);
            borrowingRepository.save(borrowing);
            resourceRepository.save(resource);

            // Update reputation scores
            userService.updateReputation(borrowing.getBorrower().getId(), 5);
            userService.updateReputation(resource.getOwner().getId(), 5);

            notificationService.notifyUser(
                    borrowing.getBorrower(),
                    "Return Confirmed!",
                    "Return verified for '" + resource.getTitle() + "'. +5 reputation points awarded!",
                    "/borrowings"
            );
            notificationService.notifyUser(
                    resource.getOwner(),
                    "Resource Returned!",
                    "'" + resource.getTitle() + "' is back in your possession and marked AVAILABLE.",
                    "/borrowings"
            );
        }

        String qrImage = qrCodeGenerator.generateQrCodeBase64(handover.getQrToken(), 260, 260);
        return toDto(handover, qrImage);
    }

    public QrHandoverDto getHandoverForBorrowing(Long borrowingId, HandoverType type) {
        Handover handover = handoverRepository.findFirstByBorrowingIdAndTypeOrderByExpiresAtDesc(borrowingId, type)
                .orElse(null);

        if (handover == null) return null;
        String qrImage = qrCodeGenerator.generateQrCodeBase64(handover.getQrToken(), 260, 260);
        return toDto(handover, qrImage);
    }

    public QrHandoverDto toDto(Handover h, String qrImage) {
        return QrHandoverDto.builder()
                .id(h.getId())
                .borrowingId(h.getBorrowing().getId())
                .resourceTitle(h.getBorrowing().getResource().getTitle())
                .borrowerName(h.getBorrowing().getBorrower().getName())
                .ownerName(h.getBorrowing().getResource().getOwner().getName())
                .qrToken(h.getQrToken())
                .type(h.getType())
                .expiresAt(h.getExpiresAt())
                .verifiedAt(h.getVerifiedAt())
                .verified(h.getVerifiedAt() != null)
                .qrCodeBase64Image(qrImage)
                .build();
    }
}
