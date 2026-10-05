package app.service;

import app.dto.BorrowingCreateRequest;
import app.dto.BorrowingDto;
import app.entity.*;
import app.exception.BorrowingConflictException;
import app.exception.InvalidRequestException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.repository.BorrowingRepository;
import app.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;
    private final UserService userService;

    @Transactional
    public BorrowingDto createBorrowingRequest(BorrowingCreateRequest request, User borrower) {
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + request.getResourceId()));

        if (resource.getOwner().getId().equals(borrower.getId())) {
            throw new InvalidRequestException("You cannot borrow your own resource.");
        }

        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new BorrowingConflictException("Resource is currently " + resource.getStatus() + " and cannot be requested.");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidRequestException("End date cannot be before start date.");
        }

        List<Borrowing> activeList = borrowingRepository.findByResourceIdAndStatusIn(
                resource.getId(),
                List.of(BorrowingStatus.PENDING, BorrowingStatus.APPROVED, BorrowingStatus.ACTIVE)
        );
        if (!activeList.isEmpty()) {
            throw new BorrowingConflictException("This resource already has an active or pending exchange request.");
        }

        Borrowing borrowing = Borrowing.builder()
                .resource(resource)
                .borrower(borrower)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(BorrowingStatus.PENDING)
                .notes(request.getNotes())
                .offeredExchange(request.getOfferedExchange() != null ? request.getOfferedExchange().trim() : null)
                .build();

        borrowing = borrowingRepository.save(borrowing);

        resource.setStatus(ResourceStatus.REQUESTED);
        resourceRepository.save(resource);

        String offerNotice = (request.getOfferedExchange() != null && !request.getOfferedExchange().isEmpty())
                ? " (Offered in exchange: " + request.getOfferedExchange() + ")"
                : "";

        notificationService.notifyUser(
                resource.getOwner(),
                "New Exchange / Borrow Request",
                borrower.getName() + " requested '" + resource.getTitle() + "' from " +
                        request.getStartDate() + " to " + request.getEndDate() + "." + offerNotice,
                "/borrowings"
        );

        return toDto(borrowing);
    }

    @Transactional
    public BorrowingDto approveBorrowing(Long borrowingId, User owner) {
        Borrowing borrowing = getBorrowingEntity(borrowingId);

        if (!borrowing.getResource().getOwner().getId().equals(owner.getId()) &&
            !owner.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("Only the resource owner can approve this exchange request.");
        }

        if (borrowing.getStatus() != BorrowingStatus.PENDING) {
            throw new InvalidRequestException("Cannot approve an exchange in status: " + borrowing.getStatus());
        }

        borrowing.setStatus(BorrowingStatus.APPROVED);
        borrowing = borrowingRepository.save(borrowing);

        notificationService.notifyUser(
                borrowing.getBorrower(),
                "Exchange Request Approved!",
                "Your request for '" + borrowing.getResource().getTitle() + "' has been accepted by " + owner.getName() + ". Mutual exchange agreed! Proceed to QR handover verification.",
                "/handover/" + borrowing.getId()
        );

        return toDto(borrowing);
    }

    @Transactional
    public BorrowingDto declineBorrowing(Long borrowingId, User owner) {
        Borrowing borrowing = getBorrowingEntity(borrowingId);

        if (!borrowing.getResource().getOwner().getId().equals(owner.getId()) &&
            !owner.getRole().name().equals("ADMIN")) {
            throw new UnauthorizedException("Only the resource owner can decline this request.");
        }

        borrowing.setStatus(BorrowingStatus.CANCELLED);
        borrowing.getResource().setStatus(ResourceStatus.AVAILABLE);
        resourceRepository.save(borrowing.getResource());
        borrowing = borrowingRepository.save(borrowing);

        notificationService.notifyUser(
                borrowing.getBorrower(),
                "Exchange Request Declined",
                "Your request for '" + borrowing.getResource().getTitle() + "' was not accepted by the owner.",
                "/borrowings"
        );

        return toDto(borrowing);
    }

    @Transactional
    public BorrowingDto markAsReturned(Long borrowingId, User currentUser) {
        Borrowing borrowing = getBorrowingEntity(borrowingId);

        boolean isOwner = borrowing.getResource().getOwner().getId().equals(currentUser.getId());
        boolean isBorrower = borrowing.getBorrower().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN") || currentUser.getRole().name().equals("MODERATOR");

        if (!isOwner && !isBorrower && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to mark this return.");
        }

        borrowing.setStatus(BorrowingStatus.RETURNED);
        borrowing.setReturnedAt(LocalDateTime.now());
        borrowing.getResource().setStatus(ResourceStatus.AVAILABLE);

        resourceRepository.save(borrowing.getResource());
        borrowing = borrowingRepository.save(borrowing);

        userService.updateReputation(borrowing.getBorrower().getId(), 5);
        userService.updateReputation(borrowing.getResource().getOwner().getId(), 5);

        notificationService.notifyUser(
                borrowing.getBorrower(),
                "Exchange & Return Completed",
                "Mutual exchange for '" + borrowing.getResource().getTitle() + "' completed with satisfaction! Reputation boosted (+5).",
                "/borrowings"
        );

        notificationService.notifyUser(
                borrowing.getResource().getOwner(),
                "Resource Returned Satisfactorily",
                "'" + borrowing.getResource().getTitle() + "' was returned by " + borrowing.getBorrower().getName() + ". Mutual satisfaction confirmed (+5 Reputation).",
                "/borrowings"
        );

        return toDto(borrowing);
    }

    public Borrowing getBorrowingEntity(Long id) {
        return borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id: " + id));
    }

    public BorrowingDto getBorrowingById(Long id) {
        return toDto(getBorrowingEntity(id));
    }

    public List<BorrowingDto> getBorrowingsByBorrower(Long borrowerId) {
        return borrowingRepository.findByBorrowerIdOrderByCreatedAtDesc(borrowerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BorrowingDto> getBorrowingsByOwner(Long ownerId) {
        return borrowingRepository.findByOwnerId(ownerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BorrowingDto> getAllBorrowings() {
        return borrowingRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BorrowingDto toDto(Borrowing b) {
        Resource r = b.getResource();
        return BorrowingDto.builder()
                .id(b.getId())
                .resourceId(r.getId())
                .resourceTitle(r.getTitle())
                .resourceCategory(r.getCategory())
                .resourceLocation(r.getLocation())
                .resourceImageUrl(r.getImageUrl())
                .sharingType(r.getSharingType())
                .exchangePreference(r.getExchangePreference())
                .satisfactionTerms(r.getSatisfactionTerms())
                .ownerId(r.getOwner().getId())
                .ownerName(r.getOwner().getName())
                .borrowerId(b.getBorrower().getId())
                .borrowerName(b.getBorrower().getName())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .status(b.getStatus())
                .offeredExchange(b.getOfferedExchange())
                .createdAt(b.getCreatedAt())
                .returnedAt(b.getReturnedAt())
                .notes(b.getNotes())
                .build();
    }
}
