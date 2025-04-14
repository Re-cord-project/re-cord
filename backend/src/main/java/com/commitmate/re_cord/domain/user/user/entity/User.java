package com.commitmate.re_cord.domain.user.user.entity;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Builder
@ToString

public class User extends BaseEntity {
    private String email;
    private String username;
    private String nickname;    // 카카오에서 받아올 닉네임 -> 추가 필요
    private String password;
    private String bootcamp;
    private int generation;
    private String refreshToken;

    @Enumerated(EnumType.STRING)
    private Provider provider;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "followerId")
    private List<Follow> followingList = new ArrayList<>();

    @OneToMany(mappedBy = "followingId")
    private List<Follow> followerList = new ArrayList<>();

    @OneToMany(mappedBy = "blockedId")
    private List<Block> blockingList = new ArrayList<>();

    public User(long id, String username, String nickname) {
        this.setId(id);
        this.username = username;
        this.nickname = nickname;
    }

    // Admin 확인하고 권한 추가
    public boolean isAdmin() {
        return role == Role.admin;
    }

    public boolean matchPassword(String password) {
        return this.password.equals(password);
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getAuthoritiesAsStringList()
                .stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    public List<String> getAuthoritiesAsStringList() {
        List<String> authorities = new ArrayList<>();

        if (isAdmin())
            authorities.add("ROLE_ADMIN");

        return authorities;
    }

//나를 차단한
//    @OneToMany(mappedBy = "blockingId")
//    private List<Follow> blockedList = new ArrayList<>();
}
