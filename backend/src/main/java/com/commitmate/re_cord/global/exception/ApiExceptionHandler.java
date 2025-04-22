package com.commitmate.re_cord.global.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestControllerAdvice
public class ApiExceptionHandler {

    // 비즈니스 로직이 던지는 IllegalArgumentException → 400 Bad Request
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    // 중복 등 IllegalStateException → 409 Conflict
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    // 인증 예외를 401로
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<String> handleAuthError(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("로그인 후 사용이 가능합니다.");
    }
}
