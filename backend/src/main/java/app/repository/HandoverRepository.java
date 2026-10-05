package app.repository;

import app.entity.Handover;
import app.entity.HandoverType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HandoverRepository extends JpaRepository<Handover, Long> {
    Optional<Handover> findByQrToken(String qrToken);
    List<Handover> findByBorrowingId(Long borrowingId);
    Optional<Handover> findFirstByBorrowingIdAndTypeOrderByExpiresAtDesc(Long borrowingId, HandoverType type);
}
