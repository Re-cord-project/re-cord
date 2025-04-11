package com.commitmate.re_cord.domain.user.user.controller;

import com.commitmate.re_cord.domain.user.user.dto.SignUpRequestDTO;
import com.commitmate.re_cord.domain.user.user.dto.UserLoginDTO;
import com.commitmate.re_cord.domain.user.user.dto.UserLoginResponseDTO;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.auth.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isEmpty() || dto.getPassword() == null || dto.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(200).body(userService.registerUser(dto));
    }

    // 로그인 - JWT 토큰 발급
    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response) {
        User user = userService.findByEmail(userLoginDTO.getEmail());
        String accessToken = userService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());
        String refreshToken = user.getRefreshToken(); // DB에서 바로 가져옴

//        // JWT를 `Authorization` 헤더에 추가
//        response.setHeader("Authorization", "Bearer " + token);

        UserLoginResponseDTO loginResponseDTO = UserLoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        return ResponseEntity.ok(loginResponseDTO);
    }
}
