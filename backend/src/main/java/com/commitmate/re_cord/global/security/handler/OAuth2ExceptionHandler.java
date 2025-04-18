package com.commitmate.re_cord.global.security.handler;

import com.commitmate.re_cord.global.exception.exceptions.OAuth2AdditionalInfoRequiredException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class OAuth2ExceptionHandler {

    @ExceptionHandler(OAuth2AdditionalInfoRequiredException.class)
    public ResponseEntity<?> handleAdditionalInfoRequired(OAuth2AdditionalInfoRequiredException ex) {
        return ResponseEntity.status(307)
                .header("Location", "/signup/oauth2?oauthId=" + ex.getOauthId())
                .build();
    }
}

