package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/update")
public class ApiV1PostUpdateController {
    private final PostService postService;

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(
            @PathVariable Long postId,
            @RequestBody @Validated PostRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        postService.updatePost(postId, dto, userDetails.getUser());
        return ResponseEntity.ok("게시글 수정 완료");
    }

    // 게시글 추천
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails // 로그인 유저 정보
    ) {
        postService.toggleLike(postId, userDetails.getUser());
        return ResponseEntity.ok().build();
    }

}