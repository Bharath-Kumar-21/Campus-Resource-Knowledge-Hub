package app.dto;

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
