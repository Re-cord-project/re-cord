package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.security.SecurityUser;
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
    private final UserRepository userRepository;
    // 게시글 등록
    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestBody @Validated PostRequestDto dto,
            @AuthenticationPrincipal SecurityUser userDetails) {

        postService.createPost(dto, userDetails.getId()); // getUsername() → getId()
        return ResponseEntity.ok("게시글 등록 완료");
    }

    // 현재 로그인한 사용자가 마지막으로 저장한 임시 글을 불러오는 API
    @GetMapping("/posts/drafts/latest")
    public ResponseEntity<PostResponseDto> getLatestDraft(@AuthenticationPrincipal SecurityUser userDetails) {
        // userId 꺼냄
        long userId = userDetails.getId();

        // 실제 유저 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 유저의 최신 임시 글 가져오기
        Optional<Post> draftOpt = postService.getLatestDraftByUser(user);

        if (draftOpt.isEmpty()) {
            return ResponseEntity.noContent().build(); // 임시 글 없을 경우 204
        }

        PostResponseDto dto = new PostResponseDto(draftOpt.get());
        return ResponseEntity.ok(dto);
    }


}