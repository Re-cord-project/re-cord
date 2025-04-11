package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequestDTO {
    private String email;
    private String username;
    private String password;
    private String bootcamp;
    private int generation;
}
