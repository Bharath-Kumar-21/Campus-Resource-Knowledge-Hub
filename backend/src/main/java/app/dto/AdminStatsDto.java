package app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private long totalStudents;
    private long totalModerators;
    private long totalAdmins;
    private long totalUsers;
    private long activeResources;
    private long totalResources;
    private long activeBorrowings;
    private long totalBorrowings;
    private long openReports;
    private long totalReports;
    private long totalDocuments;
    private long openRequests;
}
