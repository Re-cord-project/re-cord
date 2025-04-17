package com.commitmate.re_cord.global.exception.handler;

import com.commitmate.re_cord.global.exception.exceptions.OAuth2AdditionalInfoRequiredException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${custom.dev.frontUrl}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException, ServletException {

        if (exception instanceof OAuth2AdditionalInfoRequiredException ex) {
            String redirectUrl = frontendUrl + "/signup/oauth2?oauthId=" + ex.getOauthId();
            response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT); // 307
            response.setHeader("Location", redirectUrl);
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication Failed");
        }
    }
}

