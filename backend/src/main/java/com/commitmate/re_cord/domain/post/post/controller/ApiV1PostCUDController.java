package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.dto.UpdatePostStatusRequest;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class ApiV1PostCUDController {
    private final PostService postService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestPart @Validated PostRequestDto dto,  // 게시글 정보
            @RequestPart(required = false) List<MultipartFile> images,  // 이미지 파일들
            @AuthenticationPrincipal SecurityUser userDetails) {

        // 게시글 생성 및 이미지 업로드 처리
        postService.createPost(dto, images, userDetails.getId());

        return ResponseEntity.ok("게시글 등록 완료");
    }


    // 현재 로그인한 사용자가 마지막으로 저장한 임시 글을 불러오는 API
    @GetMapping("/drafts/latest")
    public ResponseEntity<PostResponseDto> getLatestDraft(@AuthenticationPrincipal SecurityUser userDetails) {
        // userId 꺼냄
        long userId = userDetails.getId();

        // 실제 유저 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 유저의 최신 임시 글 가져오기
        Optional<Post> draftOpt = postService.getLatestDraftByUser(user);

        if (draftOpt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        PostResponseDto dto = new PostResponseDto(draftOpt.get());
        return ResponseEntity.ok(dto);
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal SecurityUser userDetails) {

        // userId로 실제 User 엔티티 조회
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        postService.deletePost(postId, user);
        return ResponseEntity.ok("게시글 삭제 완료");
    }

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