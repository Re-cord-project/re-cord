package com.commitmate.re_cord.global.auth.repository;

import com.commitmate.re_cord.global.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    boolean existsByToken(String token);
}
