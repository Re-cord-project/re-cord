package com.commitmate.re_cord.domain.user.block.entity;

import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonManagedReference  // 차단 관계에서 순환 참조 방지
    private User blockerId;


    //차단 당한 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_id", nullable = false)
    @JsonBackReference  // 나를 차단한 사람 목록에서 순환 참조 방지
    private User blockedId;

}
