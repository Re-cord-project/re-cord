package com.commitmate.re_cord.global.auth.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    public String resolveToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    public boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }


}
