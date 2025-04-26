package com.commitmate.re_cord.domain.user.follow.controller;

import com.commitmate.re_cord.domain.user.follow.dto.FollowActionRequestDto;
import com.commitmate.re_cord.domain.user.follow.dto.FollowCountResponseDto;
import com.commitmate.re_cord.domain.user.follow.dto.FollowUserResponseDto;
import com.commitmate.re_cord.domain.user.follow.service.FollowService;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class ApiV1FollowController {

    private final FollowService followService;

    // 팔로우
    @Operation(summary = "특정 유저 팔로우", description = "로그인한 사용자가 다른 유저를 팔로우합니다.")
    @PostMapping("/follow")
    public ResponseEntity<String> followUser(
            @RequestBody FollowActionRequestDto request,
            @AuthenticationPrincipal SecurityUser currentUser
    ) {
        followService.follow(currentUser.getId(), request.getFollowingId());
        return ResponseEntity.ok("팔로우 완료!");
    }

    // 언팔로우
    @Operation(summary = "팔로우 취소", description = "로그인한 사용자가 팔로우를 취소합니다.")
    @DeleteMapping("/follow")
    public ResponseEntity<String> unfollowUser(
            @RequestBody FollowActionRequestDto request,
            @AuthenticationPrincipal SecurityUser currentUser
    ) {
        followService.unfollow(currentUser.getId(), request.getFollowingId());
        return ResponseEntity.ok("언팔로우 완료!");
    }

    // 내가 팔로우한 사람 목록 조회
    @Operation(summary = "내가 팔로우한 사람들 목록", description = "로그인한 사용자가 팔로우한 사람 목록을 조회합니다.")
    @GetMapping("/follow")
    public ResponseEntity<List<FollowUserResponseDto>> getFollowingList(
            @AuthenticationPrincipal SecurityUser currentUser
    ) {
        List<FollowUserResponseDto> followings = followService.getFollowingList(currentUser.getId());
        return ResponseEntity.ok(followings);
    }

    // 나를 팔로우한 사람 목록 조회
    @Operation(summary = "나를 팔로우한 사람들 목록", description = "로그인한 사용자를 팔로우한 사람 목록을 조회합니다.")
    @GetMapping("/followers")
    public ResponseEntity<List<FollowUserResponseDto>> getFollowerList(
            @AuthenticationPrincipal SecurityUser currentUser
    ) {
        List<FollowUserResponseDto> followers = followService.getFollowerList(currentUser.getId());
        return ResponseEntity.ok(followers);
    }

    //팔로우, 팔로잉 수 조회
    @Operation(summary = "특정 유저의 팔로우/팔로잉 수 조회", description = "path variable 로 넘어온 userId 에 대한 팔로워·팔로잉 수를 반환합니다.")
    @GetMapping("/{userId}/counts")
    public ResponseEntity<FollowCountResponseDto> getUserCounts(
            @PathVariable Long userId
    ) {
        long followerCount  = followService.countFollowers(userId);
        long followingCount = followService.countFollowing(userId);

        FollowCountResponseDto dto = FollowCountResponseDto.builder()
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();

        return ResponseEntity.ok(dto);
    }
}
