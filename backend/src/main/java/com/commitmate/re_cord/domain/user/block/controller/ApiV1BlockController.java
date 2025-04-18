package com.commitmate.re_cord.domain.user.block.controller;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.block.service.BlockService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/blocks")
@RequiredArgsConstructor
public class ApiV1BlockController {

    private final BlockService blockService;
    private final UserService userService;

    // 특정 유저 차단
    @Operation(
            summary = "특정 유저 차단",
            description = "로그인한 사용자(userId)가 특정 유저(blockedId)를 차단합니다."
    )
    @PostMapping("/{userId}/to/{blockedId}")
    public ResponseEntity<String> blockUser(
            @Parameter(description = "로그인한 사용자 ID", example = "1")
            @PathVariable Long userId, // 차단을 요청한 사용자 ID

            @Parameter(description = "차단할 대상 사용자 ID", example = "2")
            @PathVariable Long blockedId // 차단할 대상 사용자 ID
    ) {
        User currentUser = userService.getUserById(userId); // 로그인한 사용자 정보 조회
        blockService.blockUser(currentUser.getId(), blockedId); // 차단 처리
        return ResponseEntity.ok("차단이 완료되었습니다.");
    }

    // 특정 유저 차단 해제
    @Operation(
            summary = "특정 유저 차단 해제",
            description = "로그인한 사용자(userId)가 특정 유저(blockedId)를 차단 해제합니다."
    )
    @DeleteMapping("/{userId}/to/{blockedId}")
    public ResponseEntity<String> unblockUser(
            @Parameter(description = "로그인한 사용자 ID", example = "1")
            @PathVariable Long userId, // 차단을 해제하려는 사용자 ID

            @Parameter(description = "차단 해제할 대상 사용자 ID", example = "2")
            @PathVariable Long blockedId // 차단 해제할 대상 사용자 ID
    ) {
        User currentUser = userService.getUserById(userId); // 로그인한 사용자 정보 조회
        blockService.unblockUser(currentUser.getId(), blockedId); // 차단 해제 처리
        return ResponseEntity.ok("차단 해제 완료!");
    }

    // 차단한 유저 목록 조회
    @Operation(
            summary = "차단한 유저 목록 조회",
            description = "로그인한 사용자가 차단한 모든 유저의 목록을 조회합니다."
    )
    @GetMapping("/{userId}/blocked")
    public ResponseEntity<List<User>> getBlockedUsers(
            @Parameter(description = "로그인한 사용자 ID", example = "1")
            @PathVariable Long userId
    ) {
        List<Block> blockedUsers = blockService.getBlockedUsers(userId);
        // 차단된 유저 목록만 추출
        List<User> blockedUsersList = blockedUsers.stream()
                .map(block -> block.getBlockedId())  // 차단된 유저의 정보만 가져옴
                .collect(Collectors.toList());
        return ResponseEntity.ok(blockedUsersList);
    }
}
