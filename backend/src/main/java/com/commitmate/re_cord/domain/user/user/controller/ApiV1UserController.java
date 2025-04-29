package com.commitmate.re_cord.domain.user.user.controller;


import com.commitmate.re_cord.domain.user.user.dto.*;
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
        if (dto.getEmail() == null || dto.getEmail().isEmpty() || dto.getPassword() == null || dto.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and Password are required");
        }
        if (dto.getPassword().equals(dto.getPasswordConfirm())) {
            return ResponseEntity.status(200).body(userService.register(dto));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Password and Confirm Password are not matched"));
        }
    }

    // 이메일 중복검사
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 형식입니다.");
        }

        if (exists) {
            return ResponseEntity.status(409).body("이미 사용 중인 이메일입니다.");
        }
        return ResponseEntity.ok("사용 가능한 이메일입니다.");
    }


    // 로그인
    @Operation(
            summary = "로그인"
    )
    @PostMapping("/login")

    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        User user = userService.findByEmail(userLoginDto.getEmail());
        String token = userService.login(userLoginDto.getEmail(), userLoginDto.getPassword());

        String[] tokens = token.split(" ");
        String refreshToken = tokens[0];
        String accessToken = tokens[1];
        rq.setCookie("refreshToken", refreshToken);
        rq.setCookie("accessToken", accessToken);

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

    // 회원탈퇴
    @Operation(
            summary = "회원탈퇴"
    )
    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestParam boolean dataDeleteAgreed) {
        Long userId = rq.getActor().getId();
        if (dataDeleteAgreed) {
            userService.withdraw(userId);
        }
        rq.deleteCookie("accessToken");
        rq.deleteCookie("refreshToken");
        return ResponseEntity.ok("회원탈퇴가 정상적으로 처리되었습니다.");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @GetMapping("/{userId}/profile-image")
    public ResponseEntity<String> getProfileImageUrl(@PathVariable Long userId) {
        String profileImageUrl = userService.getProfileImageUrl(userId);
        if (profileImageUrl != null) {
            return ResponseEntity.ok(profileImageUrl);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-blogName/{blogName}")
    public ResponseEntity<UserIdResponseDto> getUserIdByBlogName(@PathVariable String blogName) {
        UserIdResponseDto userIdResponseDto = userService.getUserIdByBlogName(blogName);

        if (userIdResponseDto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userIdResponseDto);
    }
}
