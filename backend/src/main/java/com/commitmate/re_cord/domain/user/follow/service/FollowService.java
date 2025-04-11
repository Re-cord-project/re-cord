package com.commitmate.re_cord.domain.user.follow.service;

import com.commitmate.re_cord.domain.user.follow.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public void follow(User follower, Long followingId) {
        if (follower.getId().equals(followingId)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new EntityNotFoundException("해당 유저가 없습니다."));

        // 중복 체크
        boolean alreadyFollowing = followRepository.existsByFollowerIdAndFollowingId(follower, following);
        if (alreadyFollowing) {
            throw new IllegalStateException("이미 팔로우한 사용자입니다.");
        }

        Follow follow = Follow.builder()
                .followerId(follower)
                .followingId(following)
                .build();

        followRepository.save(follow);
    }
}