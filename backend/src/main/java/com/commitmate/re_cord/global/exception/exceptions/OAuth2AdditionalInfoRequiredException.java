package com.commitmate.re_cord.global.exception.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AdditionalInfoRequiredException extends AuthenticationException {
    private final String tempToken;

    public OAuth2AdditionalInfoRequiredException(String tempToken) {
        super("Additional signup info required for username: " + tempToken);
        this.tempToken = tempToken;
    }

    public String getTempToken() {
        return tempToken;
    }
}

