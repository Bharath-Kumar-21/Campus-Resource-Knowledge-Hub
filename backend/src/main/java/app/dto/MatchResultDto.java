package app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultDto {
    private ResourceDto resource;
    private int matchingScore;
    private Map<String, Double> breakdown;
    private String explanation;
    private boolean eligible;
}
