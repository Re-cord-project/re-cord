package com.commitmate.re_cord.domain.user.user.service;

import com.commitmate.re_cord.domain.user.user.dto.SignUpRequestDTO;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Transactional
    public User registUser(SignUpRequestDTO request) {
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

        user.setPassword(passwordEncoder.encode(user.getPassword()));
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
}
