package com.commitmate.re_cord.domain.user.follow.controller;

import com.commitmate.re_cord.domain.user.follow.dto.FollowUserResponse;
import com.commitmate.re_cord.domain.user.follow.service.FollowService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class ApiV1FollowController {

    private final FollowService followService;
    private final UserService userService;

    // 1. 팔로우
    @Operation(summary = "특정 유저 팔로우", description = "로그인한 사용자가 다른 유저를 팔로우합니다.")
    @PostMapping("/{userId}/follow/{followingId}")
    public ResponseEntity<String> followUser(
            @Parameter(description = "로그인한 사용자 ID", example = "1")
            @PathVariable("userId") Long userId,
            @Parameter(description = "팔로우할 대상 유저의 ID", example = "2")
            @PathVariable("followingId") Long followingId
    ) {
        User currentUser = userService.getUserById(userId);
        followService.follow(currentUser, followingId);
        return ResponseEntity.ok("팔로우 완료!");
    }

    // 2. 언팔로우
    @Operation(summary = "팔로우 취소", description = "로그인한 사용자가 팔로우를 취소합니다.")
    @DeleteMapping("/{userId}/follows/{followId}")
    public ResponseEntity<String> unfollowUser(
            @Parameter(description = "로그인한 사용자 ID", example = "1")
            @PathVariable("userId") Long userId,
            @Parameter(description = "팔로우 관계의 ID", example = "1")
            @PathVariable("followId") Long followId
    ) {
        User currentUser = userService.getUserById(userId);
        followService.unfollow(currentUser, followId);
        return ResponseEntity.ok("언팔로우 완료!");
    }


    // 3. 내가 팔로우한 사람 목록 조회
    @Operation(summary = "내가 팔로우한 사람들 목록", description = "지정한 사용자 ID가 팔로우한 사람 목록을 조회합니다.")
    @GetMapping("/{userId}/followings")
    public ResponseEntity<List<FollowUserResponse>> getFollowingList(
            @Parameter(description = "팔로잉 목록을 조회할 사용자 ID", example = "1")
            @PathVariable("userId") Long userId
    ) {
        User currentUser = userService.getUserById(userId);
        List<FollowUserResponse> followings = followService.getFollowingList(currentUser);
        return ResponseEntity.ok(followings);
    }

    // 4. 나를 팔로우한 사람 목록 조회
    @Operation(summary = "나를 팔로우한 사람들 목록", description = "지정한 사용자 ID를 팔로우한 사람 목록을 조회합니다.")
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<FollowUserResponse>> getFollowerList(
            @Parameter(description = "팔로워 목록을 조회할 사용자 ID", example = "1")
            @PathVariable("userId") Long userId
    ) {
        User currentUser = userService.getUserById(userId);
        List<FollowUserResponse> followers = followService.getFollowerList(currentUser);
        return ResponseEntity.ok(followers);
    }

}
