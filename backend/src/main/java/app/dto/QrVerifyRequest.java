package app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QrVerifyRequest {
    @NotBlank(message = "QR token is required")
    private String qrToken;
}
