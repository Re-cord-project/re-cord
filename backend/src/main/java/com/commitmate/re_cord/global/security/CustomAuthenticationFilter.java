package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.rq.Rq;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationFilter extends OncePerRequestFilter {
    private final UserService userService;
    private final Rq rq;


    record AuthTokens(String refreshToken, String accessToken) {
    }

    private AuthTokens getAuthTokensFromRequest() {
        String authorization = rq.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring("Bearer ".length());
            String[] tokenBits = token.split(" ", 2);

            if (tokenBits.length == 2)
                return new AuthTokens(tokenBits[0], tokenBits[1]);
        }

        String refreshToken = rq.getCookieValue("refreshToken");
        String accessToken = rq.getCookieValue("accessToken");

        if (refreshToken != null && accessToken != null)
            return new AuthTokens(refreshToken, accessToken);

        return null;
    }


    private void refreshAccessToken(User user) {
        String newAccessToken = userService.genAccessToken(user);

        rq.setHeader("Authorization", "Bearer " + user.getRefreshToken() + " " + newAccessToken);
        rq.setCookie("accessToken", newAccessToken);
    }

    private User refreshAccessTokenByRefreshToken(String refreshToken) {
        Optional<User> opMemberByRefreshToken = userService.findByRefreshToken(refreshToken);

        if (opMemberByRefreshToken.isEmpty()) {
            return null;
        }

        User user = opMemberByRefreshToken.get();

        refreshAccessToken(user);

        return user;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!request.getRequestURI().startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (List.of("/api/v1/members/login", "/api/v1/members/logout", "/api/v1/members/join").contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        AuthTokens authTokens = getAuthTokensFromRequest();

        if (authTokens == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String refreshToken = authTokens.refreshToken;
        String accessToken = authTokens.accessToken;

        User user = userService.getMemberFromAccessToken(accessToken);

        if (user == null)
            user = refreshAccessTokenByRefreshToken(refreshToken);

        if (user != null)
            rq.setLogin(user);

        filterChain.doFilter(request, response);
    }
}
