package app.repository;

import app.entity.Resource;
import app.entity.ResourceCategory;
import app.entity.ResourceStatus;
import app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByCategory(ResourceCategory category);
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByOwner(User owner);
    List<Resource> findByOwnerId(Long ownerId);
    List<Resource> findByTitleContainingIgnoreCase(String keyword);
    List<Resource> findByCategoryAndStatus(ResourceCategory category, ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE r.status = :status AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(r.location) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Resource> searchResources(@Param("q") String query, @Param("status") ResourceStatus status);

    long countByStatus(ResourceStatus status);
}
