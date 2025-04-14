package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/delete")
public class ApiV1PostDeleteController {
    private final PostService postService;

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        postService.deletePost(postId, userDetails.getUser());
        return ResponseEntity.ok("게시글 삭제 완료");
    }

}