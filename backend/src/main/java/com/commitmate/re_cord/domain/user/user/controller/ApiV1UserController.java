package com.commitmate.re_cord.domain.user.user.controller;


import com.commitmate.re_cord.domain.user.user.dto.OAuth2SignupRequest;
import com.commitmate.re_cord.domain.user.user.dto.SignupDto;
import com.commitmate.re_cord.domain.user.user.dto.UserDto;
import com.commitmate.re_cord.domain.user.user.dto.UserLoginResponseDto;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.rq.Rq;
import com.commitmate.re_cord.global.security.UserLoginDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;
    private final Rq rq;

    @Value("${custom.site.backUrl}")
    private String backUrl;

    @Value("${custom.site.frontUrl}")
    private String frontUrl;

    @GetMapping("/me")
    public UserDto me() {
        User user = userService.findById(rq.getActor().getId()).get();

        return new UserDto(user);
    }

    @GetMapping("/")
    public String mainPage() {

        System.out.println("backUrl = " + backUrl);
        System.out.println("frontUrl = " + frontUrl);

        return "Welcome to Main Page";
    }

    // 회원가입
    @Operation(
            summary = "회원가입"
    )
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupDto dto) {
        if(dto.getEmail()  == null || dto.getEmail().isEmpty() || dto.getPassword() == null || dto.getPassword().isEmpty()){
            return ResponseEntity.badRequest().body("Email and Password are required");
        }
        if(dto.getPassword().equals(dto.getPasswordConfirm())){
            return ResponseEntity.status(200).body(userService.register(dto));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Password and Confirm Password are not match"));
        }
    }

    // 로그인
    @Operation(
            summary = "로그인"
    )
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
    @Operation(
            summary = "로그아웃"
    )
    @DeleteMapping("/logout")
    public ResponseEntity<?> logout() {
//        userService.logout();
        rq.deleteCookie("accessToken");
        rq.deleteCookie("refreshToken");

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }




}
