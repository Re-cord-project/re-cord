package com.commitmate.re_cord.domain.user.block.repository;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {

    // 차단한 유저와 차단된 유저가 존재하는지 확인
    boolean existsByBlockerIdAndBlockedId(User blocker, User blocked);

    // 차단한 유저와 차단된 유저의 관계 삭제
    void deleteByBlockerIdAndBlockedId(User blocker, User blocked);

    // 특정 유저가 차단한 사용자 목록 조회
    List<Block> findByBlockerId(User blocker);

    // 차단 관계 조회
    Optional<Block> findByBlockerIdAndBlockedId(User blocker, User blocked);
}
