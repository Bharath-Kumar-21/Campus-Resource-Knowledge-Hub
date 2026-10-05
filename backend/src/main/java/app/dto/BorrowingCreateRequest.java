package app.dto;

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
