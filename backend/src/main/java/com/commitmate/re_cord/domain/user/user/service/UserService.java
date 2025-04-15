package com.commitmate.re_cord.domain.user.user.service;


import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
//    private final AuthTokenService authTokenService;
    private final UserRepository userRepository;

    public long count() {
        return userRepository.count();
    }

    public User join(String username, String password, String nickname) {
        userRepository
                .findByUsername(username)
                .ifPresent(member -> {
                    throw new RuntimeException("해당 username은 이미 사용중입니다.");
                });

        User user = User.builder()
                .username(username)
                .password(password)
                .nickname(nickname)
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

//    public String genAccessToken(User user) {
//        return authTokenService.genAccessToken(user);
//    }
//
//    public String genAuthToken(User user) {
//        return user.getRefreshToken() + " " + genAccessToken(user);
//    }
//
//    public User getMemberFromAccessToken(String accessToken) {
//        Map<String, Object> payload = authTokenService.payload(accessToken);
//
//        if (payload == null) return null;
//
//        long id = (long) payload.get("id");
//        String username = (String) payload.get("username");
//        String nickname = (String) payload.get("nickname");
//
//        User user = new User(id, username, nickname);
//
//        return user;
//    }

    public void modify(User user, @NotBlank String nickname) {
        user.setNickname(nickname);
    }


    public User modifyOrJoin(String username, String nickname) {
        Optional<User> opMember = findByUsername(username);

        if (opMember.isPresent()) {
            User user = opMember.get();
            modify(user, nickname);
            return user;
        }

        return join(username, "", nickname);
    }

}
