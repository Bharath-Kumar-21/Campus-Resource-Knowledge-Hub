package app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private Long id;
    private Long ownerId;
    private String title;
    private String fileName;
    private String fileUri;
    private String contentType;
    private String metadata;
    private String tags;
    private String previewText;
    private LocalDateTime createdAt;
}
