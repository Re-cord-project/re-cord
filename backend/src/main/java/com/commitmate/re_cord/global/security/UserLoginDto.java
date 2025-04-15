package com.commitmate.re_cord.global.security;

import com.commitmate.re_cord.global.validation.annotation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDto {
    @NotNull(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 형식이어야 합니다.")
    private String email;
    @NotNull(message = "비밀번호는 필수입니다.")
    @ValidPassword
    private String password;
    @NotNull(message = "사용자 이름은 필수입니다.")
    private String username;
    @Size(max = 100, message = "부트캠프명은 100자 이하여야 합니다.")
    private String bootcamp;
    private String role;
}
