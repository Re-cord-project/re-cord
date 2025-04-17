package com.commitmate.re_cord.global.exception.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AdditionalInfoRequiredException extends AuthenticationException {
    private final String username;

    public OAuth2AdditionalInfoRequiredException(String username) {
        super("Additional signup info required for username: " + username);
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}

