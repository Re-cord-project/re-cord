package com.commitmate.re_cord.domain.user.user.controller;

import com.commitmate.re_cord.domain.user.user.dto.OAuth2SignupRequest;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/oauth2")
public class ApiV1OAuth2SignupController {

    private final UserService userService;

    @Autowired
    public ApiV1OAuth2SignupController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> completeSignup(@RequestBody OAuth2SignupRequest signupRequest) {
        // 새 유저 정보 처리
        try {
            userService.completeOAuth2Signup(signupRequest.getUsername(), signupRequest.getNickname(), signupRequest.getBootcamp(), signupRequest.getGeneration());
            return ResponseEntity.ok("회원가입 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패");
        }
    }
}
