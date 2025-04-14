package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/create")
public class ApiV1PostCreateController {
    private final PostService postService;

    // 게시글 등록
    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestBody @Validated PostRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            //spring security 의존성 필요, security 에 UserDetailsImpl 필요
        postService.createPost(dto, userDetails.getUser());
        return ResponseEntity.ok("게시글 등록 완료");

    }


    // 현재 로그인한 사용자가 마지막으로 저장한 임시 글을 불러오는 API
    @GetMapping("/posts/drafts/latest")
    public ResponseEntity<PostResponseDto> getLatestDraft(@AuthenticationPrincipal UserDetailsImpl userDetails) {
       User user = userDetails.getUser(); // 인증된 유저 정보 꺼내기

        Optional<Post> draftOpt = postService.getLatestDraftByUser(user);
        if (draftOpt.isEmpty()) {
            return ResponseEntity.noContent().build(); // 임시 글 없을 경우 204 No Content 반환
        }

        PostResponseDto dto = new PostResponseDto(draftOpt.get());
        return ResponseEntity.ok(dto);
    }

}