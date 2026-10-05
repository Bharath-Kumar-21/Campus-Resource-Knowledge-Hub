package app.service;

import app.dto.AuthRequest;
import app.dto.AuthResponse;
import app.dto.RegisterRequest;
import app.dto.UserDto;
import app.entity.Role;
import app.entity.User;
import app.entity.UserStatus;
import app.exception.DuplicateEmailException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.repository.UserRepository;
import app.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateEmailException("Email " + request.getEmail() + " is already registered.");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.STUDENT;

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .reputationScore(100)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUser(
                user.getId(),
                user.getEmail(),
                "ROLE_" + user.getRole().name(),
                user.getName()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(toDto(user))
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended. Please contact campus admin.");
        }

        String token = tokenProvider.generateTokenFromUser(
                user.getId(),
                user.getEmail(),
                "ROLE_" + user.getRole().name(),
                user.getName()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(toDto(user))
                .build();
    }

    public AuthResponse refreshToken(String oldToken) {
        if (tokenProvider.validateToken(oldToken)) {
            String email = tokenProvider.getEmailFromJWT(oldToken);
            User user = getUserByEmail(email);
            String newToken = tokenProvider.generateTokenFromUser(
                    user.getId(),
                    user.getEmail(),
                    "ROLE_" + user.getRole().name(),
                    user.getName()
            );
            return AuthResponse.builder()
                    .token(newToken)
                    .tokenType("Bearer")
                    .user(toDto(user))
                    .build();
        }
        throw new UnauthorizedException("Invalid or expired refresh token");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public void updateReputation(Long userId, int delta) {
        User user = getUserById(userId);
        int newScore = Math.max(0, Math.min(100, user.getReputationScore() + delta));
        user.setReputationScore(newScore);
        userRepository.save(user);
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, UserStatus status) {
        User user = getUserById(userId);
        user.setStatus(status);
        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUserRole(Long userId, Role role) {
        User user = getUserById(userId);
        user.setRole(role);
        return toDto(userRepository.save(user));
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .reputationScore(user.getReputationScore())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
