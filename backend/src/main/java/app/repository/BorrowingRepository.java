package app.repository;

import app.entity.Borrowing;
import app.entity.BorrowingStatus;
import app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findByBorrower(User borrower);
    List<Borrowing> findByBorrowerId(Long borrowerId);
    List<Borrowing> findByBorrowerIdOrderByCreatedAtDesc(Long borrowerId);
    
    @Query("SELECT b FROM Borrowing b WHERE b.resource.owner.id = :ownerId ORDER BY b.createdAt DESC")
    List<Borrowing> findByOwnerId(@Param("ownerId") Long ownerId);

    List<Borrowing> findByStatus(BorrowingStatus status);
    long countByStatus(BorrowingStatus status);

    List<Borrowing> findByResourceIdAndStatusIn(Long resourceId, List<BorrowingStatus> statuses);

    long countByBorrowerIdAndStatus(Long borrowerId, BorrowingStatus status);

    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.borrower.id = :borrowerId AND b.status = 'RETURNED'")
    long countSuccessfulBorrowingsByBorrower(@Param("borrowerId") Long borrowerId);

    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.borrower.id = :borrowerId AND b.resource.owner.id = :ownerId AND b.status = 'RETURNED'")
    long countSuccessfulHistoryBetweenUsers(@Param("borrowerId") Long borrowerId, @Param("ownerId") Long ownerId);
}
