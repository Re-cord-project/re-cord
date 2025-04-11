package com.commitmate.re_cord.domain.user.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequestDTO {
    @NotBlank
    @Email
    private String email;
    private String username;
    private String password;
    private String bootcamp;
    private int generation;
}
