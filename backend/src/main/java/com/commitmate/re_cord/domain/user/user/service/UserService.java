package com.commitmate.re_cord.domain.user.user.service;

import com.commitmate.re_cord.domain.user.user.dto.SignUpRequestDTO;
import com.commitmate.re_cord.domain.user.user.dto.UserLoginResponseDTO;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.auth.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;


    // 회원가입
    @Transactional
    public User registerUser(SignUpRequestDTO request) {
        checkDuplicated(request.getEmail(), request.getUsername());

        if (!isValidPassword(request.getPassword())) {
            throw new IllegalArgumentException("비밀번호는 10자 이상이며 영문과 숫자/특수문자 중 2종류 이상 포함해야 합니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .bootcamp(request.getBootcamp())
                .generation(request.getGeneration())
                .role(Role.basic)
                .build();

        return userRepository.save(user);
    }

    // 이메일, username 중복 검사
    public void checkDuplicated(String email, String username) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }
    }

    // 비밀번호 조건?
    private boolean isValidPassword(String password) {
        if (password == null || password.length() < 10) return false;
        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasDigitOrSymbol = password.matches(".*[0-9\\W_].*"); // 숫자 or 특수문자
        return hasLetter && hasDigitOrSymbol;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        String accessToken = jwtProvider.createAccessToken(user);
        String refreshToken = jwtProvider.createRefreshToken(user);

        user.setRefreshToken(refreshToken); // refreshToken 컬럼에 저장
        userRepository.save(user);

        return accessToken;
    }
}
