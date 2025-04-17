package com.commitmate.re_cord.global.exception.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AdditionalInfoRequiredException extends AuthenticationException {
    private final String oauthId;

    public OAuth2AdditionalInfoRequiredException(String oauthId, String username, String email) {
        super("Additional signup info required for username: " + username);
        this.oauthId = oauthId;

    }

    public String getOauthId() {
        return oauthId;
    }


}

