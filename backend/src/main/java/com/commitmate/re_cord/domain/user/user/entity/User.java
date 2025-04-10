package com.commitmate.re_cord.domain.user.user.entity;

import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString

public class User extends BaseEntity {
    private String nickname;
    private String email;

}
