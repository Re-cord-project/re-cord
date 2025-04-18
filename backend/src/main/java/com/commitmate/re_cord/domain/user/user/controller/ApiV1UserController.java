package com.commitmate.re_cord.domain.user.user.controller;


import com.commitmate.re_cord.domain.user.user.dto.OAuth2SignupRequest;
import com.commitmate.re_cord.domain.user.user.dto.UserLoginResponseDto;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.rq.Rq;
import com.commitmate.re_cord.global.security.UserLoginDto;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController

@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;
    private final Rq rq;

    @Value("${custom.site.backUrl}")
    private String backUrl;

    @Value("${custom.site.frontUrl}")
    private String frontUrl;

    @GetMapping("/")
    public String mainPage() {

        System.out.println("backUrl = " + backUrl);
        System.out.println("frontUrl = " + frontUrl);

        return "Welcome to Main Page";
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if(user.getEmail()  == null || user.getEmail().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()){
            return ResponseEntity.badRequest().body("Email and Password are required");
        }
        return ResponseEntity.status(200).body(userService.register(user.getOauthId(), user.getEmail(), user.getPassword(), user.getUsername(),
                user.getBootcamp(), user.getGeneration()));
    }

    // 로그인
    @PostMapping("/login")

    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        User user = userService.findByEmail(userLoginDto.getEmail());
        String token = userService.login(userLoginDto.getEmail(), userLoginDto.getPassword());

        UserLoginResponseDto loginResponseDto = UserLoginResponseDto.builder()
                .accessToken(token)
                .userId(user.getId())
                .build();
        return ResponseEntity.ok(loginResponseDto);
    }
    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam Long userId) {
        userService.logout(userId);
        rq.deleteCookie("accessToken");
        rq.deleteCookie("refreshToken");

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 소셜 회원가입 시 추가 정보 받기
    @PostMapping("/api/oauth2/complete-signup")
    public ResponseEntity<?> completeSignup(@RequestBody OAuth2SignupRequest dto) {
        User user = userService.completeOAuth2Signup(
                dto.getOauthId(),
                dto.getEmail(),
//                dto.getUsername(),
                dto.getBootcamp(),
                dto.getGeneration()
        );

        String accessToken = userService.genAccessToken(user);

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "refreshToken", user.getRefreshToken()
        ));
    }


}
