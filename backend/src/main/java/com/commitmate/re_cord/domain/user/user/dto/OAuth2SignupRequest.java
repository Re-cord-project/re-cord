package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Data;

@Data
public class OAuth2SignupRequest {
    private String username;
    private String nickname;
    private String bootcamp;
    private int generation;
}
