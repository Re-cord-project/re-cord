package com.commitmate.re_cord.domain.user.follow.controller;

import com.commitmate.re_cord.domain.user.follow.service.FollowService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class FollowController {

    private final FollowService followService;

    //TODO : 현재 테스트용 유저 사용한 코드. 인증 사용가능해지면 하단의 '인증사용자 어노테이션으로 바꾼 코드'로 변경

    //테스트용 유저 사용한 코드
    //1. 팔로우
    @Operation(summary = "특정 유저 팔로우", description = "로그인한 사용자가 다른 유저를 팔로우합니다.")
    @PostMapping("/{followingId}/follow")
    public ResponseEntity<String> followUser(
            @Parameter(description = "팔로우할 대상 유저의 ID", example = "2")
            @PathVariable("followingId") Long followingId
    ) {
        User currentUser = getDummyLoginUser(); // 주의! 테스트용! 실제 로그인 유저 아님
        followService.follow(currentUser, followingId);
        return ResponseEntity.ok("팔로우 완료!");
    }

    //2. 언팔로우
    @Operation(summary = "팔로우 취소", description = "로그인한 사용자가 팔로우를 취소합니다.")
    @DeleteMapping("/follows/{followId}")
    public ResponseEntity<String> unfollowUser(
            @Parameter(description = "팔로우 관계의 ID", example = "1")
            @PathVariable("followId") Long followId
    ) {
        User currentUser = getDummyLoginUser(); // 주의! 테스트용! 실제 로그인 유저 아님
        followService.unfollow(currentUser, followId);
        return ResponseEntity.ok("언팔로우 완료!");
    }

    //테스트용 로그인 유저
    private User getDummyLoginUser() {
        return User.builder()
                .id(1L) // DevDataInitializer에서 저장된 ID와 동일해야 함
                .email("a@just.com")
                .username("그냥이")
                .password("1234")
                .build();
    }

//    //인증사용자 어노테이션으로 바꾼 코드
//    // 1. 팔로우
//    @Operation(summary = "특정 유저 팔로우", description = "로그인한 사용자가 다른 유저를 팔로우합니다.")
//    @PostMapping("/{followingId}/follow")
//    public ResponseEntity<String> followUser(
//            @Parameter(description = "팔로우할 대상 유저의 ID", example = "2")
//            @PathVariable("followingId") Long followingId,
//
//            @Parameter(hidden = true)
//            @AuthenticationPrincipal User currentUser
//    ) {
//        followService.follow(currentUser, followingId);
//        return ResponseEntity.ok("팔로우 완료!");
//    }
//
//    // 2. 언팔로우
//    @Operation(summary = "팔로우 취소", description = "로그인한 사용자가 팔로우를 취소합니다.")
//    @DeleteMapping("/follows/{followId}")
//    public ResponseEntity<String> unfollowUser(
//            @Parameter(description = "팔로우 관계의 ID", example = "1")
//            @PathVariable("followId") Long followId,
//
//            @Parameter(hidden = true)
//            @AuthenticationPrincipal User currentUser
//    ) {
//        followService.unfollow(currentUser, followId);
//        return ResponseEntity.ok("언팔로우 완료!");
//    }


}