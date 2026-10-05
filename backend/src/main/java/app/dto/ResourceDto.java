package app.dto;

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
