package com.commitmate.re_cord.domain.user.user.dto;

import com.commitmate.re_cord.domain.user.user.entity.User;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String blogname;
    private String profileImage;
    // 필요한 필드만

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.blogname = user.getBlogName();
        this.profileImage = user.getProfileImageUrl();
    }
}
