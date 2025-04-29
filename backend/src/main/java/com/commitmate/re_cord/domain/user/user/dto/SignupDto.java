package com.commitmate.re_cord.domain.user.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class SignupDto {
    @NotEmpty
    @Email
    private String email;
    @NotEmpty
    private String username;
    @NotEmpty
    private String password;
    private String passwordConfirm;
    private String bootcamp;
    private String generation;

    public SignupDto(String email, String username, String password, String passwordConfirm, String bootcamp, String  generation) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
        this.bootcamp = bootcamp;
        this.generation = generation;
    }

}
