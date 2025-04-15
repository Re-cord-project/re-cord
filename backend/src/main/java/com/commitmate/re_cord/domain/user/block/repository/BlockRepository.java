package com.commitmate.re_cord.domain.user.block.repository;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {

    // 특정 유저가 다른 유저를 차단했는지 확인
    boolean existsByBlockerIdAndBlockedId(User blocker, User blocked);
}