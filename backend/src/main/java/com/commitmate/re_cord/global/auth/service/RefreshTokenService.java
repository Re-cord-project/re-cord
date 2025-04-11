package com.commitmate.re_cord.global.auth.service;

import com.commitmate.re_cord.global.auth.entity.RefreshToken;
import com.commitmate.re_cord.global.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken addRefreshToken(RefreshToken refreshToken) {
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public void deleteRefreshToken(String refreshToken) {
        refreshTokenRepository.findByTokenValue(refreshToken).ifPresent(refreshTokenRepository::delete);
    }

    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByValue(String value) {
        return refreshTokenRepository.findByTokenValue(value);
    }
}
