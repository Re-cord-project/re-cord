package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.security.SecurityUser;
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
    private final UserRepository userRepository;
    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(
            @PathVariable Long postId,
            @RequestBody @Validated PostRequestDto dto,
            @AuthenticationPrincipal SecurityUser userDetails) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        postService.updatePost(postId, dto, user);
        return ResponseEntity.ok("게시글 수정 완료");
    }


    // 게시글 추천
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal SecurityUser userDetails) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        postService.toggleLike(postId, user);
        return ResponseEntity.ok().build();
    }

}
