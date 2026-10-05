package app.service;

import app.dto.RequestCreateDto;
import app.dto.RequestDto;
import app.entity.Request;
import app.entity.RequestStatus;
import app.entity.ResourceCategory;
import app.entity.User;
import app.exception.InvalidRequestException;
import app.exception.ResourceNotFoundException;
import app.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;

    @Transactional
    public RequestDto createRequest(RequestCreateDto dto, User requester) {
        if (dto.getNeededTo().isBefore(dto.getNeededFrom())) {
            throw new InvalidRequestException("Needed 'to' date cannot be before 'from' date.");
        }

        Request request = Request.builder()
                .requester(requester)
                .title(dto.getTitle().trim())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .keywords(dto.getKeywords())
                .neededFrom(dto.getNeededFrom())
                .neededTo(dto.getNeededTo())
                .location(dto.getLocation().trim())
                .status(RequestStatus.OPEN)
                .build();

        return toDto(requestRepository.save(request));
    }

    public Request getRequestEntity(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
    }

    public RequestDto getRequestById(Long id) {
        return toDto(getRequestEntity(id));
    }

    public List<RequestDto> getAllOpenRequests() {
        return requestRepository.findByStatus(RequestStatus.OPEN).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RequestDto> getRequestsByRequester(Long requesterId) {
        return requestRepository.findByRequesterId(requesterId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RequestDto updateRequestStatus(Long id, RequestStatus status) {
        Request request = getRequestEntity(id);
        request.setStatus(status);
        return toDto(requestRepository.save(request));
    }

    public RequestDto toDto(Request req) {
        return RequestDto.builder()
                .id(req.getId())
                .requesterId(req.getRequester().getId())
                .requesterName(req.getRequester().getName())
                .requesterReputation(req.getRequester().getReputationScore())
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .keywords(req.getKeywords())
                .neededFrom(req.getNeededFrom())
                .neededTo(req.getNeededTo())
                .location(req.getLocation())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .build();
    }
}
