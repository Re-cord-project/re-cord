package com.commitmate.re_cord.domain.user.block.controller;

import com.commitmate.re_cord.domain.user.block.service.BlockService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blocks") // 시큐리티 컨피그 협의 후 변경
@RequiredArgsConstructor
public class ApiV1BlockController {

    private final BlockService blockService;
    private final UserService userService;

    @Operation(
            summary = "특정 유저 차단",
            description = "사용자(userId)가 특정 유저(blockedId)를 차단"
    )
    @PostMapping("/user/{userId}/to/{blockedId}")
    public ResponseEntity<String> blockUser(
            @Parameter(description = "차단하는 사용자 ID", example = "1")
            @PathVariable Long userId,

            @Parameter(description = "차단 대상 사용자 ID", example = "2")
            @PathVariable Long blockedId
    ) {
        User currentUser = userService.getUserById(userId);
        blockService.blockUser(currentUser.getId(), blockedId);
        return ResponseEntity.ok("차단이 완료되었습니다.");
    }
}
