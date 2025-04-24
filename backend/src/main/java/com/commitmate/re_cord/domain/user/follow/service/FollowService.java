package com.commitmate.re_cord.domain.user.follow.service;

import com.commitmate.re_cord.domain.user.follow.dto.FollowUserResponseDto;
import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.follow.repository.FollowRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserService userService;

    //팔로우
    @Transactional
    public void follow(Long followerId, Long followingId) {
        // follower / following 조회 (EntityNotFoundException 발생 시 404)
        User follower  = userService.getUserById(followerId);
        User following = userService.getUserById(followingId);

        // 자기 자신 팔로우 방지
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("자기 자신은 팔로우할 수 없습니다.");
        }

        // 중복 팔로우 방지
        boolean already = followRepository.existsByFollowerIdAndFollowingId(follower, following);
        if (already) {
            throw new IllegalStateException("이미 팔로우한 사용자입니다.");
        }

        // 저장
        Follow f = Follow.builder()
                .followerId(follower)
                .followingId(following)
                .build();
        followRepository.save(f);
    }

   //언팔로우
    @Transactional
    public void unfollow(Long followerId, Long followingId) {
        // follower / following 조회
        User follower  = userService.getUserById(followerId);
        User following = userService.getUserById(followingId);

        // 관계 확인
        Follow f = followRepository.findByFollowerIdAndFollowingId(follower, following)
                .orElseThrow(() -> new IllegalArgumentException("팔로우 정보를 찾을 수 없습니다."));

        // 삭제
        followRepository.delete(f);
    }

    // 내가 팔로우한 사람 목록
    @Transactional(readOnly = true)
    public List<FollowUserResponseDto> getFollowingList(Long followerId) {
        User follower = userService.getUserById(followerId);

        return followRepository.findAllByFollowerId(follower).stream()
                .map(f -> {
                    User u = f.getFollowingId();
                    return FollowUserResponseDto.builder()
                            .userId(u.getId())
                            .username(u.getUsername())
                            .email(u.getEmail())
                            .build();
                })
                .toList();
    }

    // 나를 팔로우한 사람 목록
    @Transactional(readOnly = true)
    public List<FollowUserResponseDto> getFollowerList(Long followingId) {
        User following = userService.getUserById(followingId);

        return followRepository.findAllByFollowingId(following).stream()
                .map(f -> {
                    User u = f.getFollowerId();
                    return FollowUserResponseDto.builder()
                            .userId(u.getId())
                            .username(u.getUsername())
                            .email(u.getEmail())
                            .build();
                })
                .toList();
    }
}
