package com.commitmate.re_cord.domain.user.follow.repository;

import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // 1. 팔로우 관계 존재 여부 확인 (중복 방지용)
    Optional<Follow> findByFollowerIdAndFollowingId(User follower, User following);

    // 2. 내가 팔로우한 유저 목록 (A → B)
    List<Follow> findAllByFollowerId(User follower);

    // 3. 나를 팔로우한 유저 목록 (B ← A)
    List<Follow> findAllByFollowingId(User following);

    // 4. 언팔로우 시 해당 Follow 엔티티를 삭제해야 하므로 찾기
    Optional<Follow> findByIdAndFollowerId(Long followId, User follower);
}