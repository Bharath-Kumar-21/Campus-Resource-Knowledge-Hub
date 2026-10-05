package app.service;

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
            default -> "/images/products/arduino_kit.jpg";
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
