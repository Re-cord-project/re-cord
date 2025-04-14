package com.commitmate.re_cord.domain.user.user.entity;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString

@Table(name="users") //user는 h2데이터베이스 기본 예약어

public class User extends BaseEntity {
    private String email;
    private String username;
    private String password;
    private String bootcamp;
    private int generation;
    @Enumerated(EnumType.STRING)
    private Provider provider;
    @Enumerated(EnumType.STRING)
    private Role role;

    //내가 팔로잉하는
    @OneToMany(mappedBy = "followerId")
    private List<Follow> followingList = new ArrayList<>();

    //나를 팔로우하는
    @OneToMany(mappedBy = "followingId")
    private List<Follow> followerList = new ArrayList<>();


    //내가 차단한
    @OneToMany(mappedBy = "blockedId")
    private List<Block> blockingList = new ArrayList<>();

    //나를 차단한
//    @OneToMany(mappedBy = "blockingId")
//    private List<Follow> blockedList = new ArrayList<>();
}
