package app.dto;

import app.entity.ResourceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RequestCreateDto {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Category is required")
    private ResourceCategory category;

    private String keywords;

    @NotNull(message = "Needed from date is required")
    private LocalDate neededFrom;

    @NotNull(message = "Needed to date is required")
    private LocalDate neededTo;

    @NotBlank(message = "Location is required")
    private String location;
}
