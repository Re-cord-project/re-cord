package com.commitmate.re_cord.domain.user.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDTO {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
}
