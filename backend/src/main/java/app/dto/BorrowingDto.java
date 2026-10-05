package app.dto;

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
