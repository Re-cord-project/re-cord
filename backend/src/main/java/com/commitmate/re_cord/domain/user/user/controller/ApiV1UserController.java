package com.commitmate.re_cord.domain.user.user.controller;


import com.commitmate.re_cord.domain.user.user.dto.UserLoginResponseDto;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.security.UserLoginDto;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;


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
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(200).body(userService.register(user.getEmail(), user.getPassword(), user.getUsername(), user.getNickname(),
                user.getBootcamp(), user.getGeneration()));
    }

    // 로그인
    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        User user = userService.findByEmail(userLoginDto.getEmail());
        String token = userService.login(userLoginDto.getEmail(), userLoginDto.getPassword());

        UserLoginResponseDto loginResponseDto = UserLoginResponseDto.builder()
                .accessToken(token)
                .userId(user.getId())
                .build();
        return ResponseEntity.ok(loginResponseDto);
    }
}
