package app.service;

import app.dto.MatchResultDto;
import app.dto.ResourceDto;
import app.entity.Request;
import app.entity.Resource;
import app.entity.ResourceStatus;
import app.repository.BorrowingRepository;
import app.repository.RequestRepository;
import app.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final ResourceRepository resourceRepository;
    private final RequestRepository requestRepository;
    private final BorrowingRepository borrowingRepository;
    private final ResourceService resourceService;

    // Configurable weights from application.properties (defaulting to prompt specification)
    @Value("${app.matching.weight.relevance:0.30}")
    private double weightRelevance;

    @Value("${app.matching.weight.location:0.20}")
    private double weightLocation;

    @Value("${app.matching.weight.availability:0.20}")
    private double weightAvailability;

    @Value("${app.matching.weight.reputation:0.15}")
    private double weightReputation;

    @Value("${app.matching.weight.recency:0.10}")
    private double weightRecency;

    @Value("${app.matching.weight.history:0.05}")
    private double weightHistory;

    public List<MatchResultDto> findMatchesForRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));

        // Get candidate resources that are AVAILABLE and not owned by the requester
        List<Resource> candidates = resourceRepository.findByStatus(ResourceStatus.AVAILABLE).stream()
                .filter(r -> !r.getOwner().getId().equals(request.getRequester().getId()))
                .collect(Collectors.toList());

        List<MatchResultDto> matches = new ArrayList<>();

        for (Resource resource : candidates) {
            double relevance = calculateRelevance(request, resource);
            double location = calculateLocation(request.getLocation(), resource.getLocation());
            double availability = calculateAvailability(request.getNeededFrom(), request.getNeededTo(),
                    resource.getAvailabilityFrom(), resource.getAvailabilityTo());
            double reputation = calculateReputation(resource.getOwner().getReputationScore());
            double recency = calculateRecency(resource.getCreatedAt());
            double historyFit = calculateHistoryFit(request.getRequester().getId(), resource.getOwner().getId());

            // Weighted formula
            double composite = (weightRelevance * relevance) +
                               (weightLocation * location) +
                               (weightAvailability * availability) +
                               (weightReputation * reputation) +
                               (weightRecency * recency) +
                               (weightHistory * historyFit);

            int finalScore = (int) Math.round(Math.min(100.0, Math.max(0.0, composite)));

            Map<String, Double> breakdown = new LinkedHashMap<>();
            breakdown.put("Relevance", relevance);
            breakdown.put("Location", location);
            breakdown.put("Availability", availability);
            breakdown.put("Reputation", reputation);
            breakdown.put("Recency", recency);
            breakdown.put("HistoryFit", historyFit);

            String explanation = buildExplanation(finalScore, request, resource, breakdown);

            ResourceDto resourceDto = resourceService.toDto(resource);

            matches.add(MatchResultDto.builder()
                    .resource(resourceDto)
                    .matchingScore(finalScore)
                    .breakdown(breakdown)
                    .explanation(explanation)
                    .eligible(availability >= 50.0)
                    .build());
        }

        // Sort matches descending by highest matching score
        matches.sort((a, b) -> Integer.compare(b.getMatchingScore(), a.getMatchingScore()));
        return matches;
    }

    private double calculateRelevance(Request req, Resource res) {
        double score = 0.0;

        // 1. Category match
        if (req.getCategory() == res.getCategory()) {
            score += 50.0;
        }

        // 2. Keyword & Text overlap (title, description, keywords)
        Set<String> requestTokens = tokenize(req.getTitle() + " " + (req.getDescription() != null ? req.getDescription() : "") + " " + (req.getKeywords() != null ? req.getKeywords() : ""));
        Set<String> resourceTokens = tokenize(res.getTitle() + " " + (res.getDescription() != null ? res.getDescription() : ""));

        if (!requestTokens.isEmpty() && !resourceTokens.isEmpty()) {
            long common = requestTokens.stream().filter(resourceTokens::contains).count();
            double jaccard = (double) common / (double) (requestTokens.size() + resourceTokens.size() - common);
            score += Math.min(50.0, jaccard * 100.0);
        } else if (req.getCategory() == res.getCategory()) {
            score += 25.0;
        }

        return Math.min(100.0, score);
    }

    private double calculateLocation(String reqLoc, String resLoc) {
        if (reqLoc == null || resLoc == null) return 50.0;
        String l1 = reqLoc.trim().toLowerCase();
        String l2 = resLoc.trim().toLowerCase();

        if (l1.equals(l2)) return 100.0;
        if (l1.contains(l2) || l2.contains(l1)) return 85.0;

        // Campus common areas
        if ((l1.contains("library") && l2.contains("library")) ||
            (l1.contains("lab") && l2.contains("lab")) ||
            (l1.contains("block") && l2.contains("block"))) {
            return 75.0;
        }

        return 50.0; // Same general campus radius
    }

    private double calculateAvailability(LocalDate reqFrom, LocalDate reqTo, LocalDate resFrom, LocalDate resTo) {
        if (reqFrom == null || reqTo == null || resFrom == null || resTo == null) return 50.0;

        // Perfect cover
        if (!resFrom.isAfter(reqFrom) && !resTo.isBefore(reqTo)) {
            return 100.0;
        }

        // Check if there is overlap
        LocalDate overlapStart = reqFrom.isAfter(resFrom) ? reqFrom : resFrom;
        LocalDate overlapEnd = reqTo.isBefore(resTo) ? reqTo : resTo;

        if (!overlapStart.isAfter(overlapEnd)) {
            long totalDays = ChronoUnit.DAYS.between(reqFrom, reqTo) + 1;
            long overlapDays = ChronoUnit.DAYS.between(overlapStart, overlapEnd) + 1;
            return Math.min(90.0, Math.max(20.0, (double) overlapDays / (double) totalDays * 100.0));
        }

        return 10.0; // Dates do not overlap
    }

    private double calculateReputation(Integer repScore) {
        if (repScore == null) return 70.0;
        return Math.max(0.0, Math.min(100.0, (double) repScore));
    }

    private double calculateRecency(LocalDateTime createdAt) {
        if (createdAt == null) return 50.0;
        long days = ChronoUnit.DAYS.between(createdAt, LocalDateTime.now());
        if (days <= 2) return 100.0;
        if (days <= 7) return 85.0;
        if (days <= 14) return 70.0;
        if (days <= 30) return 50.0;
        return 30.0;
    }

    private double calculateHistoryFit(Long requesterId, Long ownerId) {
        long mutualReturns = borrowingRepository.countSuccessfulHistoryBetweenUsers(requesterId, ownerId);
        if (mutualReturns >= 2) return 100.0;
        if (mutualReturns == 1) return 80.0;

        long totalBorrowerReturns = borrowingRepository.countSuccessfulBorrowingsByBorrower(requesterId);
        if (totalBorrowerReturns >= 3) return 60.0;

        return 40.0; // New or clean interaction
    }

    private String buildExplanation(int score, Request req, Resource res, Map<String, Double> breakdown) {
        List<String> highlights = new ArrayList<>();

        if (req.getCategory() == res.getCategory()) {
            highlights.add("same category (" + req.getCategory() + ")");
        }

        if (breakdown.get("Availability") >= 90.0) {
            highlights.add("available for all requested dates");
        } else if (breakdown.get("Availability") >= 50.0) {
            highlights.add("partially covers requested dates");
        }

        if (breakdown.get("Location") >= 80.0) {
            highlights.add("nearby campus location (" + res.getLocation() + ")");
        }

        if (breakdown.get("Reputation") >= 85.0) {
            highlights.add("high owner reputation (" + res.getOwner().getReputationScore() + " pts)");
        }

        if (breakdown.get("HistoryFit") >= 70.0) {
            highlights.add("proven prior borrowing history");
        }

        if (highlights.isEmpty()) {
            highlights.add("general campus listing match");
        }

        return score + "% match — " + String.join(", ", highlights) + ".";
    }

    private Set<String> tokenize(String text) {
        if (text == null) return Collections.emptySet();
        return Arrays.stream(text.toLowerCase().split("[^a-zA-Z0-9]+"))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());
    }
}
