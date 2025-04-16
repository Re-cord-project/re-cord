package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/read")
public class ApiV1PostReadController {
    private final PostService postService;

    // 게시글 전체 목록 보기
    @GetMapping("/posts")
    public Page<PostResponseDto> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return postService.getAllPosts(page, size);
    }

    // 게시글 하나 상세 보기
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    // 검색 api
    @GetMapping("/search")
    public ResponseEntity<Page<PostResponseDto>> searchPosts(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<PostResponseDto> result = postService.searchPosts(keyword, page, size);
        return ResponseEntity.ok(result);
    }

    // 카테고리별로 보는 API
    @GetMapping("/posts/category/{categoryId}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<PostResponseDto> posts = postService.getPostsByCategory(categoryId, page, size);
        return ResponseEntity.ok(posts);
    }
}
