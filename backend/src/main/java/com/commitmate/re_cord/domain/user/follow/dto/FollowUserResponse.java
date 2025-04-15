package com.commitmate.re_cord.domain.user.follow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FollowUserResponse {

    private Long userId;
    private String username;
    private String email;

    @Builder
    public FollowUserResponse(Long userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
}