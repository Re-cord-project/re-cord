package com.commitmate.re_cord.global.auth.jwt;

import com.commitmate.re_cord.domain.user.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtProvider {
    private final byte[] accessSecret;
    private final byte[] refreshSecret;

    public static final Long ACCESS_TOKEN_EXPIRE_COUNT = 30*60*1000L; // 유지시간 30분
    public static final Long REFRESH_TOKEN_EXPIRE_COUNT = 30*60*1000L;

    // application.yml에서 가져오기

    public JwtProvider(@Value("${jwt.secret.access}") String accessSecret, @Value("${jwt.secret.refresh}") String refreshSecret) {
        this.accessSecret = accessSecret.getBytes(StandardCharsets.UTF_8);
        this.refreshSecret = refreshSecret.getBytes(StandardCharsets.UTF_8);
    }

    public String generateAccessToken(User user, Long expire, byte[] secretKey) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());

        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("bootcamp", user.getBootcamp());
        claims.put("generation", user.getGeneration());
        claims.put("role", user.getRole().name());
        claims.put("provider", user.getProvider().name());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .signWith(getSigningKey(secretKey))
                .compact();
    }

    private static Key getSigningKey(byte[] secretKey){
        return Keys.hmacShaKeyFor(secretKey);
    }

    public String createAccessToken(User user) {
        return generateAccessToken(user, ACCESS_TOKEN_EXPIRE_COUNT, accessSecret);
    }

    public String createRefreshToken(User user){
        return generateAccessToken(user, REFRESH_TOKEN_EXPIRE_COUNT, refreshSecret);
    }

    public Claims parseToken(String token, byte[] secretKey){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey(secretKey))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Claims parseAccessToken(String accessToken){
        return parseToken(accessToken, accessSecret);
    }
    public Claims parseRefreshToken(String refreshToken){
        return parseToken(refreshToken, refreshSecret);
    }

    public Long getUserIdFromToken(String token) {
        //Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsIm5hbWUiOiJ0ZXN0IiwidXNlcklkIjoxLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzQxMjIyMjIzLCJleHAiOjE3NDEyMjQwMjN9.Mw2TmisHqjWyECxjRbSYMvja2L41r1-_7m4IllBLsS4
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("JWT 토큰이 없습니다.");
        }

        if (!token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효하지 않은 형식입니다.");
        }
        Claims claims = parseToken(token, accessSecret);
        if (claims == null) {
            throw new IllegalArgumentException("유효하지 않은 형식입니다.");
        }
        Object userId = claims.get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        } else {
            throw new IllegalArgumentException("JWT토큰에서 userId를 찾을 수 없습니다.");
        }
    }
}
