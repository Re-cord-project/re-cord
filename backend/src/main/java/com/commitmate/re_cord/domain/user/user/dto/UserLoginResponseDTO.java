package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginResponseDTO {
    private String accessToken;
    private String refreshToken;
}
