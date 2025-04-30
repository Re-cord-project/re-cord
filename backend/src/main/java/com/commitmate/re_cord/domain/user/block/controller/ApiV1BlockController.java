package com.commitmate.re_cord.domain.user.block.controller;

import com.commitmate.re_cord.domain.user.block.dto.BlockActionRequestDto;
import com.commitmate.re_cord.domain.user.block.dto.BlockUserResponseDto;
import com.commitmate.re_cord.domain.user.block.service.BlockService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/block")
@RequiredArgsConstructor
public class ApiV1BlockController {

    private final BlockService blockService;
    private final UserService userService;

    // 유저 차단
    @Operation(
            summary = "특정 유저 차단",
            description = "로그인한 사용자가 특정 유저를 차단합니다."
    )
    @PostMapping
    public ResponseEntity<String> blockUser(
            @RequestBody BlockActionRequestDto request, // 차단할 대상 사용자 ID
            @AuthenticationPrincipal SecurityUser currentUser // 인증된 사용자 정보
    ) {
        blockService.blockUser(currentUser.getId(), request.getBlockedId()); // 차단 처리
        return ResponseEntity.ok("차단이 완료되었습니다.");
    }

    // 유저 차단 해제
    @Operation(
            summary = "특정 유저 차단 해제",
            description = "로그인한 사용자가 특정 유저를 차단 해제합니다."
    )
    @DeleteMapping
    public ResponseEntity<String> unblockUser(
            @RequestBody BlockActionRequestDto request, // 차단 해제할 대상 사용자 ID
            @AuthenticationPrincipal SecurityUser currentUser // 인증된 사용자 정보
    ) {
        blockService.unblockUser(currentUser.getId(), request.getBlockedId()); // 차단 해제 처리
        return ResponseEntity.ok("차단 해제 완료!");
    }

    // 차단한 유저 목록 조회
    @Operation(summary = "차단한 유저 목록 조회", description = "로그인한 사용자가 차단한 모든 유저를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<BlockUserResponseDto>> getBlockedList(
            @AuthenticationPrincipal SecurityUser currentUser
    ) {
        List<BlockUserResponseDto> blockedList
                = blockService.getBlockedList(currentUser.getId());
        return ResponseEntity.ok(blockedList);
    }
}
