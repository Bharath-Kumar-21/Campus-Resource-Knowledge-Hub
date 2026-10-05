const fs = require('fs');
const path = require('path');

function writeNoBom(filePath, content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Written: ' + filePath);
}

// 1. Resource.java
const resourcePath = 'D:/CRKH/backend/src/main/java/app/entity/Resource.java';
let resourceCode = `package app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceCategory category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate availabilityFrom;

    @Column(nullable = false)
    private LocalDate availabilityTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 50)
    private String itemCondition;

    @Column(length = 50)
    private String sharingType; // FREE_BORROW, ITEM_EXCHANGE, SKILL_SWAP, SECURITY_PLEDGE

    @Column(length = 500)
    private String exchangePreference;

    @Column(length = 500)
    private String satisfactionTerms;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ResourceStatus.AVAILABLE;
        }
        if (itemCondition == null || itemCondition.trim().isEmpty()) {
            itemCondition = "Good";
        }
        if (sharingType == null || sharingType.trim().isEmpty()) {
            sharingType = "FREE_BORROW";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
`;
writeNoBom(resourcePath, resourceCode);

// 2. ResourceDto.java
const resDtoPath = 'D:/CRKH/backend/src/main/java/app/dto/ResourceDto.java';
let resDtoCode = `package app.dto;

import app.entity.ResourceCategory;
import app.entity.ResourceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private Integer ownerReputation;
    private String title;
    private String description;
    private ResourceCategory category;
    private String location;
    private LocalDate availabilityFrom;
    private LocalDate availabilityTo;
    private ResourceStatus status;
    private String imageUrl;
    private String itemCondition;
    private String sharingType;
    private String exchangePreference;
    private String satisfactionTerms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
`;
writeNoBom(resDtoPath, resDtoCode);

// 3. ResourceCreateRequest.java
const resReqPath = 'D:/CRKH/backend/src/main/java/app/dto/ResourceCreateRequest.java';
let resReqCode = `package app.dto;

import app.entity.ResourceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ResourceCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Category is required")
    private ResourceCategory category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Availability start date is required")
    private LocalDate availabilityFrom;

    @NotNull(message = "Availability end date is required")
    private LocalDate availabilityTo;

    private String imageUrl;
    private String itemCondition;
    private String sharingType;
    private String exchangePreference;
    private String satisfactionTerms;
}
`;
writeNoBom(resReqPath, resReqCode);

// 4. Borrowing.java
const borrowingPath = 'D:/CRKH/backend/src/main/java/app/entity/Borrowing.java';
let borrowingCode = `package app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrowings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Borrowing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "borrower_id", nullable = false)
    private User borrower;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowingStatus status;

    @Column(length = 500)
    private String offeredExchange;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime returnedAt;

    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = BorrowingStatus.PENDING;
        }
    }
}
`;
writeNoBom(borrowingPath, borrowingCode);

// 5. BorrowingDto.java
const borDtoPath = 'D:/CRKH/backend/src/main/java/app/dto/BorrowingDto.java';
let borDtoCode = `package app.dto;

import app.entity.BorrowingStatus;
import app.entity.ResourceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingDto {
    private Long id;
    private Long resourceId;
    private String resourceTitle;
    private ResourceCategory resourceCategory;
    private String resourceLocation;
    private String resourceImageUrl;
    private String sharingType;
    private String exchangePreference;
    private String satisfactionTerms;
    private Long ownerId;
    private String ownerName;
    private Long borrowerId;
    private String borrowerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BorrowingStatus status;
    private String offeredExchange;
    private LocalDateTime createdAt;
    private LocalDateTime returnedAt;
    private String notes;
}
`;
writeNoBom(borDtoPath, borDtoCode);

// 6. BorrowingCreateRequest.java
const borReqPath = 'D:/CRKH/backend/src/main/java/app/dto/BorrowingCreateRequest.java';
let borReqCode = `package app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BorrowingCreateRequest {
    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String offeredExchange;
    private String notes;
}
`;
writeNoBom(borReqPath, borReqCode);

// 7. ResourceService.java
const resServicePath = 'D:/CRKH/backend/src/main/java/app/service/ResourceService.java';
let resServiceCode = `package app.service;

import app.dto.ResourceCreateRequest;
import app.dto.ResourceDto;
import app.entity.Resource;
import app.entity.ResourceCategory;
import app.entity.ResourceStatus;
import app.entity.User;
import app.exception.InvalidRequestException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public String saveUploadedImage(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }
        try {
            Path uploadDir = Paths.get("uploads/products").toAbsolutePath().normalize();
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            String original = imageFile.getOriginalFilename();
            String ext = ".jpg";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }
            String fileName = "item_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
            Path target = uploadDir.resolve(fileName);
            Files.copy(imageFile.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/products/" + fileName;
        } catch (IOException e) {
            throw new InvalidRequestException("Failed to upload product image: " + e.getMessage());
        }
    }

    public String getCategoryFallbackImage(ResourceCategory category) {
        if (category == null) return "/images/products/arduino_kit.jpg";
        return switch (category) {
            case TEXTBOOK -> "/images/products/dbms_book.jpg";
            case CALCULATOR -> "/images/products/casio_calculator.jpg";
            case HDMI_CABLE -> "/images/products/hdmi_cable.jpg";
            case ADAPTER -> "/images/products/usbc_adapter.jpg";
            case LAB_EQUIPMENT -> "/images/products/breadboard_lab.jpg";
            case NOTES -> "/images/products/network_notes.jpg";
            case OTHER -> "/images/products/arduino_kit.jpg";
        };
    }

    @Transactional
    public ResourceDto createResource(ResourceCreateRequest request, User owner) {
        return createResource(request, null, owner);
    }

    @Transactional
    public ResourceDto createResource(ResourceCreateRequest request, MultipartFile imageFile, User owner) {
        if (request.getAvailabilityTo().isBefore(request.getAvailabilityFrom())) {
            throw new InvalidRequestException("Availability end date cannot be before start date.");
        }

        String finalImageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            finalImageUrl = saveUploadedImage(imageFile);
        } else if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            finalImageUrl = request.getImageUrl().trim();
        } else {
            finalImageUrl = getCategoryFallbackImage(request.getCategory());
        }

        String sharingType = request.getSharingType() != null && !request.getSharingType().trim().isEmpty()
                ? request.getSharingType().trim() : "FREE_BORROW";

        Resource resource = Resource.builder()
                .owner(owner)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation().trim())
                .availabilityFrom(request.getAvailabilityFrom())
                .availabilityTo(request.getAvailabilityTo())
                .imageUrl(finalImageUrl)
                .itemCondition(request.getItemCondition() != null && !request.getItemCondition().trim().isEmpty() ? request.getItemCondition().trim() : "Good")
                .sharingType(sharingType)
                .exchangePreference(request.getExchangePreference() != null ? request.getExchangePreference().trim() : null)
                .satisfactionTerms(request.getSatisfactionTerms() != null ? request.getSatisfactionTerms().trim() : null)
                .status(ResourceStatus.AVAILABLE)
                .build();

        return toDto(resourceRepository.save(resource));
    }

    @Transactional
    public ResourceDto updateResource(Long id, ResourceCreateRequest request, User currentUser) {
        return updateResource(id, request, null, currentUser);
    }

    @Transactional
    public ResourceDto updateResource(Long id, ResourceCreateRequest request, MultipartFile imageFile, User currentUser) {
        Resource resource = getResourceEntity(id);

        if (!resource.getOwner().getId().equals(currentUser.getId()) &&
            !currentUser.getRole().name().equals("ADMIN") &&
            !currentUser.getRole().name().equals("MODERATOR")) {
            throw new UnauthorizedException("You are not authorized to edit this resource.");
        }

        if (request.getAvailabilityTo().isBefore(request.getAvailabilityFrom())) {
            throw new InvalidRequestException("Availability end date cannot be before start date.");
        }

        resource.setTitle(request.getTitle().trim());
        resource.setDescription(request.getDescription());
        resource.setCategory(request.getCategory());
        resource.setLocation(request.getLocation().trim());
        resource.setAvailabilityFrom(request.getAvailabilityFrom());
        resource.setAvailabilityTo(request.getAvailabilityTo());

        if (imageFile != null && !imageFile.isEmpty()) {
            resource.setImageUrl(saveUploadedImage(imageFile));
        } else if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            resource.setImageUrl(request.getImageUrl().trim());
        }

        if (request.getItemCondition() != null) {
            resource.setItemCondition(request.getItemCondition().trim());
        }
        if (request.getSharingType() != null && !request.getSharingType().trim().isEmpty()) {
            resource.setSharingType(request.getSharingType().trim());
        }
        if (request.getExchangePreference() != null) {
            resource.setExchangePreference(request.getExchangePreference().trim());
        }
        if (request.getSatisfactionTerms() != null) {
            resource.setSatisfactionTerms(request.getSatisfactionTerms().trim());
        }

        return toDto(resourceRepository.save(resource));
    }

    @Transactional
    public void deleteResource(Long id, User currentUser) {
        Resource resource = getResourceEntity(id);

        if (!resource.getOwner().getId().equals(currentUser.getId()) &&
            !currentUser.getRole().name().equals("ADMIN") &&
            !currentUser.getRole().name().equals("MODERATOR")) {
            throw new UnauthorizedException("You are not authorized to delete this resource.");
        }

        resource.setStatus(ResourceStatus.INACTIVE);
        resourceRepository.save(resource);
    }

    public Resource getResourceEntity(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public ResourceDto getResourceById(Long id) {
        return toDto(getResourceEntity(id));
    }

    public List<ResourceDto> getAllAvailableResources() {
        return resourceRepository.findByStatus(ResourceStatus.AVAILABLE).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ResourceDto> searchResources(String query, ResourceCategory category) {
        List<Resource> results;
        if (query != null && !query.trim().isEmpty()) {
            results = resourceRepository.searchResources(query.trim(), ResourceStatus.AVAILABLE);
        } else if (category != null) {
            results = resourceRepository.findByCategoryAndStatus(category, ResourceStatus.AVAILABLE);
        } else {
            results = resourceRepository.findByStatus(ResourceStatus.AVAILABLE);
        }

        if (category != null && query != null && !query.trim().isEmpty()) {
            results = results.stream()
                    .filter(r -> r.getCategory() == category)
                    .collect(Collectors.toList());
        }

        return results.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ResourceDto> getResourcesByOwner(Long ownerId) {
        return resourceRepository.findByOwnerId(ownerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ResourceDto toDto(Resource r) {
        return ResourceDto.builder()
                .id(r.getId())
                .ownerId(r.getOwner().getId())
                .ownerName(r.getOwner().getName())
                .ownerEmail(r.getOwner().getEmail())
                .ownerReputation(r.getOwner().getReputationScore())
                .title(r.getTitle())
                .description(r.getDescription())
                .category(r.getCategory())
                .location(r.getLocation())
                .availabilityFrom(r.getAvailabilityFrom())
                .availabilityTo(r.getAvailabilityTo())
                .status(r.getStatus())
                .imageUrl(r.getImageUrl())
                .itemCondition(r.getItemCondition() != null ? r.getItemCondition() : "Good")
                .sharingType(r.getSharingType() != null ? r.getSharingType() : "FREE_BORROW")
                .exchangePreference(r.getExchangePreference())
                .satisfactionTerms(r.getSatisfactionTerms())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
`;
writeNoBom(resServicePath, resServiceCode);

// 8. BorrowingService.java
const borServicePath = 'D:/CRKH/backend/src/main/java/app/service/BorrowingService.java';
let borServiceCode = `package app.service;

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
`;
writeNoBom(borServicePath, borServiceCode);

// 9. WebController.java (Update createResourceSubmit and updateResourceSubmit with MultipartFile)
const webCtrlPath = 'D:/CRKH/backend/src/main/java/app/controller/WebController.java';
let webCtrl = fs.readFileSync(webCtrlPath, 'utf8');

// Replace createResourceSubmit
webCtrl = webCtrl.replace(
  /@PostMapping\("\/resources\/new"\)[\s\S]*?public String createResourceSubmit\([\s\S]*?\{[\s\S]*?resourceService\.createResource\(request,\s*user\);[\s\S]*?return "redirect:\/resources\?created=true";[\s\S]*?\}/,
  `@PostMapping("/resources/new")
    public String createResourceSubmit(
            @ModelAttribute ResourceCreateRequest request,
            @RequestParam(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        resourceService.createResource(request, imageFile, user);
        return "redirect:/resources?created=true";
    }`
);

// Replace updateResourceSubmit
webCtrl = webCtrl.replace(
  /@PostMapping\("\/resources\/\{id\}\/edit"\)[\s\S]*?public String updateResourceSubmit\([\s\S]*?\{[\s\S]*?resourceService\.updateResource\(id,\s*request,\s*user\);[\s\S]*?return "redirect:\/resources\/" \+ id \+ "\?updated=true";[\s\S]*?\}/,
  `@PostMapping("/resources/{id}/edit")
    public String updateResourceSubmit(
            @PathVariable Long id,
            @ModelAttribute ResourceCreateRequest request,
            @RequestParam(value = "imageFile", required = false) org.springframework.web.multipart.MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserById(principal.getId());
        resourceService.updateResource(id, request, imageFile, user);
        return "redirect:/resources/" + id + "?updated=true";
    }`
);

writeNoBom(webCtrlPath, webCtrl);

// 10. WebMvcConfig.java (serve /uploads/products/**)
const webMvcPath = 'D:/CRKH/backend/src/main/java/app/config/WebMvcConfig.java';
let webMvc = fs.readFileSync(webMvcPath, 'utf8');
if (!webMvc.includes('/uploads/products/**')) {
  webMvc = webMvc.replace(
    'Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();',
    `Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path uploadProductsPath = Paths.get("uploads/products").toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:" + uploadProductsPath.toString() + "/");`
  );
  writeNoBom(webMvcPath, webMvc);
}

console.log('All backend exchange and image upload enhancements deployed!');
