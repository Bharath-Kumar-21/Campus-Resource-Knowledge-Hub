package app.dto;

import app.entity.RequestStatus;
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
public class RequestDto {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private Integer requesterReputation;
    private String title;
    private String description;
    private ResourceCategory category;
    private String keywords;
    private LocalDate neededFrom;
    private LocalDate neededTo;
    private String location;
    private RequestStatus status;
    private LocalDateTime createdAt;
}
