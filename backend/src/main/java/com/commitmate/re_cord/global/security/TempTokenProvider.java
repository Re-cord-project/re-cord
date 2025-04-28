package com.commitmate.re_cord.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TempTokenProvider {
    private final Key key;

    // 비밀 키 (나중에 설정파일에서 관리하면 더 좋아)
    private static final String SECRET = "very_secret_temp_token_for_additional_info_signup_1234567890";

    public TempTokenProvider() {
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // 임시 토큰 생성 (5분짜리)
    public String createTempToken(String oauthId, String username, String email) {
        long now = System.currentTimeMillis();
        long expiry = now + 5 * 60 * 1000; // 5분

        Map<String, Object> claims = new HashMap<>();
        claims.put("oauthId", oauthId);
        claims.put("username", username);
        claims.put("email", email);

        return Jwts.builder()
                .subject("temp-signup")
                .claims(claims)
                .issuedAt(new Date(now))
                .expiration(new Date(expiry))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 임시 토큰 파싱
    public Map<String, Object> parseTempToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("임시 토큰이 만료되었습니다");
        } catch (Exception e) {
            throw new RuntimeException("임시 토큰 검증에 실패했습니다");
        }
    }
}
