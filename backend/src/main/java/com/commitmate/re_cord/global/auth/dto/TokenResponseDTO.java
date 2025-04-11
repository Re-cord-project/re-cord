package com.commitmate.re_cord.global.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TokenResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType;

    public static TokenResponseDTO of(String accessToken, String refreshToken) {
        return TokenResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }
}

