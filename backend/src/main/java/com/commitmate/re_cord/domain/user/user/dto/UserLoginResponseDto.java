package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginResponseDto {
    private String accessToken;
    private Long userId;
}
