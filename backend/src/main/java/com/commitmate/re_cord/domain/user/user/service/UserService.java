package com.commitmate.re_cord.domain.user.user.service;


import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final AuthTokenService authTokenService;
    private final UserRepository userRepository;

    // 일반 회원가입
    @Transactional
    public String register(String email, String password, String username, String nickname,
                           String bootcamp, int generation) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already exists";
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(username);
        user.setNickname(nickname);
        user.setBootcamp(bootcamp);
        user.setGeneration(generation);
        user.setRole(Role.basic);
        userRepository.save(user);
        return "User registered successfully";
    }

    // 일반 로그인
    @Transactional
    public String login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent() && password.equals(userOptional.get().getPassword())) {
            User user = userOptional.get();

            // 리프레시 토큰 생성
            String refreshToken = UUID.randomUUID().toString();

            // 생성된 리프레시 토큰을 사용자 엔티티에 저장
            user.setRefreshToken(refreshToken);

            // 사용자 정보 업데이트 (리프레시 토큰 저장)
            userRepository.save(user);

            // 액세스 토큰 생성
            String accessToken = authTokenService.genAccessToken(user);

            // 리프레시 토큰과 액세스 토큰을 결합하여 반환 (예: 클라이언트에게 전달)
            return user.getRefreshToken() + " " + accessToken;
        }

        return null;
    }

    // 로그아웃
    // 토큰 비활성화 필요

    // 소셜 로그인
    public long count() {
        return userRepository.count();
    }

    public User join(String username, String password, String nickname, Provider provider) {
        userRepository
                .findByUsername(username)
                .ifPresent(member -> {
                    throw new RuntimeException("해당 username은 이미 사용중입니다.");
                });

        User user = User.builder()
                .username(username)
                .password(password)
                .nickname(nickname)
                .provider(provider)
                .refreshToken(UUID.randomUUID().toString())
                .build();

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(long authorId) {
        return userRepository.findById(authorId);
    }

    public Optional<User> findByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken);
    }

    public String genAccessToken(User user) {
        return authTokenService.genAccessToken(user);
    }

    public String genAuthToken(User user) {
        return user.getRefreshToken() + " " + genAccessToken(user);
    }

    public User getMemberFromAccessToken(String accessToken) {
        Map<String, Object> payload = authTokenService.payload(accessToken);

        if (payload == null) return null;

        long id = (long) payload.get("id");
        String username = (String) payload.get("username");
        String nickname = (String) payload.get("nickname");

        User user = new User(id, username, nickname);

        return user;
    }

    public void modify(User user, @NotBlank String nickname) {
        user.setNickname(nickname);
    }

    public User modifyOrJoin(String username, String nickname, Provider provider) {
        Optional<User> opMember = findByUsername(username);

        if (opMember.isPresent()) {
            User user = opMember.get();
            modify(user, nickname);
            user.setProvider(provider);
            return user;
        }

        return join(username, "", nickname, provider);
    }


    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 사용자를 찾을 수 없습니다."));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("해당 이메일을 찾을 수 없습니다."));
    }


}
