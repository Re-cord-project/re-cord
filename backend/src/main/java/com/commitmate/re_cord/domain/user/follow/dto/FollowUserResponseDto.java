package com.commitmate.re_cord.domain.user.follow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FollowUserResponseDto {

    private Long userId;
    private String username;
    private String email;
    private boolean hasFollowed;

    @Builder
    public FollowUserResponseDto(Long userId, String username, String email, boolean hasFollowed) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.hasFollowed  = hasFollowed;
    }
}