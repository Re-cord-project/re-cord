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
@Table(name = "users")
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

    @OneToMany(mappedBy = "followerId")
    private List<Follow> followingList = new ArrayList<>();

    @OneToMany(mappedBy = "followingId")
    private List<Follow> followerList = new ArrayList<>();

    @OneToMany(mappedBy = "blockerId")
    private List<Block> blockingList = new ArrayList<>();

    @OneToMany(mappedBy = "blockedId")
    private List<Block> blockedList = new ArrayList<>();
}
