package com.commitmate.re_cord.domain.user.user.controller;

import com.commitmate.re_cord.domain.user.user.dto.OAuth2SignupRequest;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController

public class ApiV1OAuth2SignupController {

    private final UserService userService;

    @Autowired
    public ApiV1OAuth2SignupController(UserService userService) {
        this.userService = userService;
    }

//    @PostMapping("/signup")
//    public ResponseEntity<String> completeSignup(@RequestBody OAuth2SignupRequest signupRequest) {
//        // 새 유저 정보 처리
//        try {
//            userService.completeOAuth2Signup(signupRequest.getOauthId(), signupRequest.getEmail(), signupRequest.getBootcamp(), signupRequest.getGeneration());
//            return ResponseEntity.ok("회원가입 완료");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패");
//        }
//    }
//
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
