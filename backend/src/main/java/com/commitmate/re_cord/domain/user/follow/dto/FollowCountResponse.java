package com.commitmate.re_cord.domain.user.follow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FollowCountResponse {

    private Long userId;
    private int followingCount;
    private int followerCount;

    @Builder
    public FollowCountResponse(Long userId, int followingCount, int followerCount) {
        this.userId = userId;
        this.followingCount = followingCount;
        this.followerCount = followerCount;
    }
}