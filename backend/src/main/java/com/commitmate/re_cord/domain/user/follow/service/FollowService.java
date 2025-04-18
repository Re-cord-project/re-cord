package com.commitmate.re_cord.domain.user.follow.service;

import com.commitmate.re_cord.domain.user.follow.dto.FollowUserResponse;
import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.follow.repository.FollowRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service // 서비스 레이어로 등록 (스프링 빈)
@RequiredArgsConstructor // 생성자 주입 자동 생성 (final 필드에만 적용)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    /**
     * 팔로우 기능 - 로그인한 유저(follower, A)가 다른 유저(following, B)를 팔로우
     *
     * @param follower 로그인한 사용자 (보통 SecurityContext에서 주입)
     * @param followingId 팔로우할 대상 유저의 ID
     */
    @Transactional
    public void follow(User follower, Long followingId) {

        // 1. 자기 자신은 팔로우할 수 없음
        if (follower.getId().equals(followingId)) {
            throw new IllegalArgumentException("자기 자신은 팔로우할 수 없습니다.");
        }

        // 2. 팔로우 대상 유저가 실제로 존재하는지 검증
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 대상 사용자가 존재하지 않습니다."));

        // 3. 이미 팔로우한 상태인지 확인 (중복 방지)
        boolean alreadyFollowing = followRepository.existsByFollowerIdAndFollowingId(follower, following);
        if (alreadyFollowing) {
            throw new IllegalStateException("이미 팔로우한 사용자입니다.");
        }

        // 4. Follow 객체 생성 (빌더 패턴 사용)
        Follow follow = Follow.builder()
                .followerId(follower)
                .followingId(following)
                .build();

        // 5. DB에 저장
        followRepository.save(follow);
    }

    /**
     * 언팔로우 기능 - 로그인한 유저(follower, A)가 특정 followId(B)를 삭제함
     *
     * @param follower 로그인한 사용자 (보통 SecurityContext에서 주입)
     * @param followId 삭제할 Follow 엔티티의 ID
     */
    @Transactional
    public void unfollow(User follower, Long followId) {

        // 1. 팔로우 엔티티가 존재하고, 로그인한 사용자가 소유자인지 확인
        Follow follow = followRepository.findByIdAndFollowerId(followId, follower)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 정보를 찾을 수 없습니다."));

        // 2. 삭제
        followRepository.delete(follow);
    }


    // 내가 팔로우한 사람들
    @Transactional(readOnly = true)
    public List<FollowUserResponse> getFollowingList(User currentUser) {
        return followRepository.findAllByFollowerId(currentUser).stream()
                .map(follow -> {
                    User following = follow.getFollowingId();
                    return FollowUserResponse.builder()
                            .userId(following.getId())
                            .username(following.getUsername())
                            .email(following.getEmail())
                            .build();
                })
                .toList(); // Java 16 이상이면 toList(), 아니면 collect(Collectors.toList())
    }

    // 나를 팔로우한 사람들
    @Transactional(readOnly = true)
    public List<FollowUserResponse> getFollowerList(User currentUser) {
        return followRepository.findAllByFollowingId(currentUser).stream()
                .map(follow -> {
                    User follower = follow.getFollowerId();
                    return FollowUserResponse.builder()
                            .userId(follower.getId())
                            .username(follower.getUsername())
                            .email(follower.getEmail())
                            .build();
                })
                .toList();
    }
}
