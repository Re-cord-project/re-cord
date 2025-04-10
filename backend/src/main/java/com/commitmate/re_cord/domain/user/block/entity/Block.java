package com.commitmate.re_cord.domain.user.block.entity;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Block extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "blocker_id")
    private User blockerId;

    @ManyToOne
    @JoinColumn(name = "blocked_id")
    private User blockedId;
}
