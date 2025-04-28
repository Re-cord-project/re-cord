package com.commitmate.re_cord.global.exception.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AdditionalInfoRequiredException extends AuthenticationException {
    private final String oauthId;
    private final String email;

    public OAuth2AdditionalInfoRequiredException(String oauthId, String username, String email) {
        super("Additional signup info required for username: " + username);
        this.oauthId = oauthId;
        this.email = email;
    }

    public String getOauthId() {
        return oauthId;
    }

    public String getEmail() {
        return email;
    }


}

