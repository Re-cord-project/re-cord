package com.commitmate.re_cord.domain.user.follow.service;

import com.commitmate.re_cord.domain.user.follow.entity.Follow;
import com.commitmate.re_cord.domain.user.follow.repository.FollowRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FollowServiceTest {

    @Autowired
    private FollowService followService;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = userRepository.save(User.builder()
                .username("그냥이A")
                .email("a@just.com")
                .password("1234")
                .build());

        userB = userRepository.save(User.builder()
                .username("금토일B")
                .email("b@rabbit.com")
                .password("5678")
                .build());

        System.out.println("userA ID: " + userA.getId());
        System.out.println("userB ID: " + userB.getId());
    }

    @Test
    void 팔로우_성공_테스트() {
        followService.follow(userA, userB.getId());

        List<Follow> follows = followRepository.findAll();
        assertThat(follows).hasSize(1);
        assertThat(follows.get(0).getFollowerId()).isEqualTo(userA);
        assertThat(follows.get(0).getFollowingId()).isEqualTo(userB);
    }

    @Test
    void 자기자신_팔로우_예외() {
        assertThatThrownBy(() -> followService.follow(userA, userA.getId()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("자기 자신은 팔로우할 수 없습니다.");
    }

    @Test
    void 중복_팔로우_예외() {
        followService.follow(userA, userB.getId());

        assertThatThrownBy(() -> followService.follow(userA, userB.getId()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("이미 팔로우한 사용자입니다.");
    }

    @Test
    void 존재하지않는_유저_팔로우_예외() {
        Long notExistId = 999L;

        assertThatThrownBy(() -> followService.follow(userA, notExistId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("팔로우 대상 사용자가 존재하지 않습니다.");
    }
}