package com.commitmate.re_cord.global.exception.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AdditionalInfoRequiredException extends AuthenticationException {
    private final String username;
    private final String nickname;
    private final String email;

    public OAuth2AdditionalInfoRequiredException(String username, String nickname, String email) {
        super("Additional signup info required for username: " + username);
        this.username = username;
        this.nickname = nickname;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public String getNickname() {
        return nickname;
    }

    public String getEmail() {
        return email;
    }
}

