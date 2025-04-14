package com.commitmate.re_cord.domain.user.follow.controller;

import com.commitmate.re_cord.domain.user.follow.service.FollowService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class FollowController {

    private final FollowService followService;

    //원래 코드
//    @PostMapping("/{followingId}/follow")
//    public ResponseEntity<String> followUser(@PathVariable Long followingId, @AuthenticationPrincipal User currentUser) {
//        followService.follow(currentUser, followingId);
//        return ResponseEntity.ok("팔로우 완료!");
//    }

    //테스트용 인증 사용자 말고 그냥 사용자 코드
    @PostMapping("/{followingId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long followingId) {
        User currentUser = getDummyLoginUser(); // 로그인 유저 흉내내기

        followService.follow(currentUser, followingId);
        return ResponseEntity.ok("팔로우 완료!");
    }

    private User getDummyLoginUser() {
        return User.builder()
                .id(1L)
                .email("dummy@just.com")
                .username("그냥이")
                .password("1234")
                .build();
    }
}