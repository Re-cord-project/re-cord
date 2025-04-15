package com.commitmate.re_cord.domain.user.follow.repository;

import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // [중복 방지용] 특정 사용자가 특정 사용자를 이미 팔로우했는지 여부 확인 (existsBy 방식은 boolean 반환이라 성능 좋음)
    boolean existsByFollowerIdAndFollowingId(User follower, User following);

    // [조회용] 특정 사용자가 팔로우하고 있는 모든 사용자 목록 조회
    // A->B 팔로우 했다면 followerId = A인 Follow만 찾아서 followingId를 꺼내서 B 정보를 찾는 것
    List<Follow> findAllByFollowerId(User follower);

    // [조회용] 특정 사용자가 팔로우 받고 있는 모든 사용자 목록 조회
    // A->B 팔로우  follwingId = B인 Follow만 찾아서 FollowerId를 꺼내서 A 정보를 찾는 것
    List<Follow> findAllByFollowingId(User following);

    // [언팔로우용] 팔로우 ID와 팔로워 ID를 기준으로 Follow 엔티티 조회 (권한 검증에 사용됨)
    Optional<Follow> findByIdAndFollowerId(Long followId, User follower);

    // [조회용] 두 사람 간의 팔로우 관계를 직접 조회하고 싶을 때 (예: 상세 정보 확인)
    Optional<Follow> findByFollowerIdAndFollowingId(User follower, User following);
}