package app.repository;

import app.entity.Request;
import app.entity.RequestStatus;
import app.entity.ResourceCategory;
import app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByRequester(User requester);
    List<Request> findByRequesterId(Long requesterId);
    List<Request> findByCategory(ResourceCategory category);
    List<Request> findByStatus(RequestStatus status);
    long countByStatus(RequestStatus status);
}
