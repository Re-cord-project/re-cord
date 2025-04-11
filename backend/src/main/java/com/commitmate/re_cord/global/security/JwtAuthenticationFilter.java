package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.auth.jwt.JwtProvider;
import com.commitmate.re_cord.global.security.CustomUserDetails.CustomUserDetails;
import com.commitmate.re_cord.global.security.exception.JwtExceptionCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();

        // 인증이 필요 없는 URI는 필터를 건너뛰기 (예: 로그인, 로그인 폼, H2 콘솔)
        if (uri.equals("/login") || uri.startsWith("/loginform") || uri.startsWith("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }


        // Authorization 헤더에서 토큰 추출
        String token = getToken(request);

        if (StringUtils.hasText(token)) {
            try {
                // 토큰을 기반으로 Authentication 객체 생성
                Authentication authentication = getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (ExpiredJwtException e) {
                request.setAttribute("exception", JwtExceptionCode.EXPIRED_TOKEN.getCode());
                log.error("Expired Token: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Expired token exception", e);
            } catch (UnsupportedJwtException e) {
                request.setAttribute("exception", JwtExceptionCode.UNSUPPORTED_TOKEN.getCode());
                log.error("Unsupported Token: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Unsupported token exception", e);
            } catch (MalformedJwtException e) {
                request.setAttribute("exception", JwtExceptionCode.INVALID_TOKEN.getCode());
                log.error("Invalid Token: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Invalid token exception", e);
            } catch (IllegalArgumentException e) {
                request.setAttribute("exception", JwtExceptionCode.NOT_FOUND_TOKEN.getCode());
                log.error("Token not found: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Token not found exception", e);
            } catch (Exception e) {
                log.error("JWT Filter - Internal Error: {}", token, e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("JWT Filter - Internal Error", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    // 헤더에서 Bearer 토큰 추출 (쿠키 등 다른 저장소를 사용하려면 추가 가능)
    private String getToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return null;
    }

    // 토큰을 파싱하여 Authentication 객체 생성
    private Authentication getAuthentication(String token) {
        Claims claims = jwtProvider.parseAccessToken(token);
        String email = claims.getSubject();
        String username = claims.get("username", String.class);
        String name = claims.get("name", String.class);
        // claim으로부터 권한 리스트 추출
        List<GrantedAuthority> grantedAuthorities = getGrantedAuthorities(claims);

        // DB 접근 없이 토큰의 Claim 정보만 가지고 UserDetails를 생성하기 위해, dummy User 객체 생성
        User dummyUser = User.builder()
                .email(email)
                .username(username)
                // password는 JWT 기반 인증에서는 필요 없으므로 빈 문자열 사용
                .password("")
                // bootcamp, generation 등은 없으면 기본값 처리 (필요 시 Claim에서 추가 추출)
                .bootcamp("")
                .generation(0)
                // role은 JWT Claim에 포함되어 있으므로 생략하거나 null 처리
                .role(null)
                .build();

        // CustomUserDetails 생성: 이제 이전 Deprecated 버전 대신 새 CustomUserDetails를 사용
        CustomUserDetails customUserDetails = new CustomUserDetails(dummyUser);

        return new JwtAuthenticationToken(grantedAuthorities, customUserDetails, null);
    }

    // Claims의 "roles" 항목을 기반으로 GrantedAuthority 목록 생성
    private List<GrantedAuthority> getGrantedAuthorities(Claims claims) {
        List<String> roles = (List<String>) claims.get("roles");
        if (roles == null) {
            return List.of();
        }
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }
}
