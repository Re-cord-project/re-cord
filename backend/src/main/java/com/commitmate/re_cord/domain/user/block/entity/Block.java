package com.commitmate.re_cord.domain.user.block.entity;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "block")
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Block extends BaseEntity {

    //차단 한 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocker_id", nullable = false)
    private User blockerId;

    //차단 당한사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_id", nullable = false)
    private User blockedId;

}
