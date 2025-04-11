package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.global.auth.jwt.JwtProvider;
import com.commitmate.re_cord.global.security.CustomUserDetails.CustomUserDetails_depre;
import com.commitmate.re_cord.global.security.exception.JwtExceptionCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();

        // 인증 필요 없는 URI는 필터 무시
        if (uri.equals("/login") || uri.equals("/loginform") || uri.startsWith("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }

        // request로부터 토큰을 얻어와야함
        String token = getToken(request);
        // UserDetails 형태로 SecurityContextholder에 넣어주자
        if (StringUtils.hasText(token)) {
            try {
                // 아래 두줄 짤라고 아래 메서드들이랑 JwtAuthenticationToken같은 클래스 만든거
                Authentication authentication = getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (ExpiredJwtException e){
                request.setAttribute("exception", JwtExceptionCode.EXPIRED_TOKEN.getCode());
                log.error("Expired Token : {}",token,e);
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Expired token exception", e);
            }catch (UnsupportedJwtException e){
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
                log.error("JWT Filter - Internal Error : {}", token, e);
                SecurityContextHolder.clearContext();   // 클리어 해줘야 다음에 또 쓴다
                throw new BadCredentialsException("JWT Filter - Internal Error");
            }
        }

        filterChain.doFilter(request, response);
    }

    // 토큰 얻어오기
    private String getToken(HttpServletRequest request) {
        // 헤더를 통해 토큰을 넘겨줬다면
        String authorization = request.getHeader("Authorization");
        // Bearer 다음 문자열부터가 토큰이다
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access_token")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }


    // 토큰에서 claim(사용자 정보) 꺼내기
    private Authentication getAuthentication(String token) {
        Claims claims = jwtProvider.parseAccessToken(token);
        String email = claims.getSubject();
        Long userId = claims.get("userId", Long.class);
        String name = claims.get("name", String.class);
        String username = claims.get("username", String.class);
        // 권한
        List<GrantedAuthority> grantedAuthorities = getGrantedAuthorities(claims);

        // UserDetails객체로 변형
        CustomUserDetails_depre customUserDetails = new CustomUserDetails_depre(username, "", name, grantedAuthorities);
        return new JwtAuthenticationToken(grantedAuthorities, customUserDetails, null);
    }
    // 클레임에서 권한 꺼내기
    private List<GrantedAuthority> getGrantedAuthorities(Claims claims) {
        List<String> roles = (List<String>) claims.get("roles");
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }
}

