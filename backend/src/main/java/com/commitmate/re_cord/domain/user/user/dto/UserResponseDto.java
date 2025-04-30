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

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.blogname = user.getBlogName();
        this.profileImage = user.getProfileImageUrl();
    }

    // ✅ 정적 팩토리 메서드 추가
    public static UserResponseDto from(User user) {
        return new UserResponseDto(user);
    }
}
