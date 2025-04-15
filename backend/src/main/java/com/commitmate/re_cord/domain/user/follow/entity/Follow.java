package com.commitmate.re_cord.domain.user.follow.entity;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "follow")
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class Follow extends BaseEntity {

    //1. 팔로우 요청한 사람 (나, A)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User followerId;

    //2. 팔로우 받은 사람 (상대, B)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable =false)
    private User followingId;

}
