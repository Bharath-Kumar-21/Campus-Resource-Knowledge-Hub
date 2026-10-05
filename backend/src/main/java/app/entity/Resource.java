package app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceCategory category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate availabilityFrom;

    @Column(nullable = false)
    private LocalDate availabilityTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 50)
    private String itemCondition;

    @Column(length = 50)
    private String sharingType; // FREE_BORROW, ITEM_EXCHANGE, SKILL_SWAP, SECURITY_PLEDGE

    @Column(length = 500)
    private String exchangePreference;

    @Column(length = 500)
    private String satisfactionTerms;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ResourceStatus.AVAILABLE;
        }
        if (itemCondition == null || itemCondition.trim().isEmpty()) {
            itemCondition = "Good";
        }
        if (sharingType == null || sharingType.trim().isEmpty()) {
            sharingType = "FREE_BORROW";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
