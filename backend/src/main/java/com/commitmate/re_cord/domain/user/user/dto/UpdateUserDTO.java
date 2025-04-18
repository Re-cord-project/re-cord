package com.commitmate.re_cord.domain.user.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@NoArgsConstructor
public class UpdateUserDTO {

    private String username;
    private String email;
    private String bootcamp;
    private int generation;
    private String profileImageUrl;
    private String introduction;

    public UpdateUserDTO(String username, String email, String bootcamp, int generation, String profileImageUrl, String introduction) {
        this.username = username;
        this.email = email;
        this.bootcamp = bootcamp;
        this.generation = generation;
        this.profileImageUrl = profileImageUrl;
        this.introduction = introduction;
    }
}
