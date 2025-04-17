package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@NoArgsConstructor
public class OAuth2SignupRequest {
    private String email;
    private String username;
    private String nickname;
    private String bootcamp;
    private int generation;
}
