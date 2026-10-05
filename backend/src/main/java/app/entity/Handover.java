package app.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "handovers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Handover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "borrowing_id", nullable = false)
    private Borrowing borrowing;

    @Column(nullable = false, unique = true)
    private String qrToken;

    private LocalDateTime verifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HandoverType type;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
