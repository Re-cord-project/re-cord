package com.commitmate.re_cord.domain.user.follow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FollowCountResponseDto {

    private long followingCount;
    private long followerCount;

    @Builder
    public FollowCountResponseDto(long followingCount, long followerCount) {
        this.followingCount = followingCount;
        this.followerCount = followerCount;
    }

}
