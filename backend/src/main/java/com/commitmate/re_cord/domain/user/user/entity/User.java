package com.commitmate.re_cord.domain.user.user.entity;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.user.enums.Provider;
import com.commitmate.re_cord.domain.user.user.enums.Role;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Builder
@ToString
@Table(name="users") //user는 h2데이터베이스 기본 예약어
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User extends BaseEntity {
    private String oauthId;    // 카카오에서 받아올 oauthId -> 추가 필요
    private String email;
    private String username;
    private String password;
    private String bootcamp;
    private int generation;
    private String refreshToken;

    @Column(columnDefinition = "TEXT DEFAULT ''")
    private String introduction = ""; // 자기소개, 기본값 공백

    @Column(nullable = true)
    private String profileImageUrl; //프로필 이미지, 기본값 제공


    @Enumerated(EnumType.STRING)
    private Provider provider;
    @Enumerated(EnumType.STRING)
    private Role role;

//    //내가 팔로잉하는
//    @OneToMany(mappedBy = "followerId")
//    private List<Follow> followingList = new ArrayList<>();
//
//    //나를 팔로우하는
//    @OneToMany(mappedBy = "followingId")
//    private List<Follow> followerList = new ArrayList<>();
//
//
//    //내가 차단한
//    @OneToMany(mappedBy = "blockedId")
//    private List<Block> blockingList = new ArrayList<>();

    //나를 차단한

//    @OneToMany(mappedBy = "blockingId")
//    private List<Follow> blockedList = new ArrayList<>();

    public User(long id, String oauthId, String username) {
        this.setId(id);
        this.oauthId = oauthId;
        this.username = username;
    }

    public User(long id, String username) {
        this.setId(id);
        this.setUsername(username);
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


}
