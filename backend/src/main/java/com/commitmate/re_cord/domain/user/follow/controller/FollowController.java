package com.commitmate.re_cord.domain.user.follow.controller;

import com.commitmate.re_cord.domain.user.follow.service.FollowService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{followingId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long followingId, @AuthenticationPricipal User currentUser) {
        followService.follow(currentUser, followingId);
        return ResponseEntity.ok("팔로우 완료!");
    }
}