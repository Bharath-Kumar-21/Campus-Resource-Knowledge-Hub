package app.repository;

import app.entity.Document;
import app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwner(User owner);

    @Query("SELECT d FROM Document d WHERE d.owner.id = :ownerId ORDER BY d.createdAt DESC")
    List<Document> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);

    @Query("SELECT d FROM Document d WHERE d.owner.id = :ownerId AND (" +
           "(d.title IS NOT NULL AND LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(d.tags IS NOT NULL AND LOWER(d.tags) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(d.metadata IS NOT NULL AND LOWER(d.metadata) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "(d.textContent IS NOT NULL AND LOWER(d.textContent) LIKE LOWER(CONCAT('%', :query, '%')))) " +
           "ORDER BY d.createdAt DESC")
    List<Document> searchUserDocuments(@Param("ownerId") Long ownerId, @Param("query") String query);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") Long ownerId);

    long count();
}