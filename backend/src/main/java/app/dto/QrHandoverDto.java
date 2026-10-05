package app.dto;

import app.entity.HandoverType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrHandoverDto {
    private Long id;
    private Long borrowingId;
    private String resourceTitle;
    private String borrowerName;
    private String ownerName;
    private String qrToken;
    private HandoverType type;
    private LocalDateTime expiresAt;
    private LocalDateTime verifiedAt;
    private boolean verified;
    private String qrCodeBase64Image;
}
