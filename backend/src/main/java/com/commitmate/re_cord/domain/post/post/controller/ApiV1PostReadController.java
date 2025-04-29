package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.mypage.service.MyPagePostService;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/public")
public class ApiV1PostReadController {
    private final PostService postService;
    private final MyPagePostService myPagePostService;
    // 게시글 전체 목록 보기
    @GetMapping
    public Page<PostResponseDto> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return postService.getAllPosts(page, size);
    }

    // 게시글 하나 상세 보기
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    //게시글 좋아요 수
    @GetMapping("/{postId}/likes")
    public ResponseEntity<Integer> getLikes(@PathVariable Long postId) {
        int likeCount = postService.getPostLikes(postId);
        return ResponseEntity.ok(likeCount);
    }

    //게시글 조회수
    @GetMapping("/{postId}/views")
    public ResponseEntity<Integer> getViews(@PathVariable Long postId) {
        int viewCount = postService.getPostViews(postId);
        return ResponseEntity.ok(viewCount);
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
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<PostResponseDto> posts = postService.getPostsByCategory(categoryId, page, size);
        return ResponseEntity.ok(posts);
    }


    // 작성자의 다른 게시글 조회
    @GetMapping("/{userid}/other-posts")
    public List<PostResponseDto> getOtherPostsBySameUser(
            @PathVariable Long userid,
            @RequestParam(required = false) Long excludePostId) {
        return postService.getOtherPostsBySameUser(userid, excludePostId);
    }

    // 작성자의 모든 게시글 조회
    @GetMapping("/{userid}/posts")
    public List<PostResponseDto> getAllPostsBySameUser(@PathVariable Long userid) {
        return postService.getAllPostsByUser(userid);
    }

    // 작성자의 모든 게시글 리스트
    @GetMapping("/{userId}/posts/list")
    public ResponseEntity<Page<PostResponseDto>> getAllPostsBySameUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PostResponseDto> posts = postService.getAllPostsByUser(userId, page, size);
        return ResponseEntity.ok(posts);
    }

    // 특정 사용자의 게시글 조회수 총합
    @GetMapping("/views/{userId}")
    public Long getTotalPostViews(@PathVariable Long userId) {
        return myPagePostService.getTotalPostViews(userId);
    }

    // 특정 사용자의 게시글 좋아요 총합
    @GetMapping("/likes/{userId}")
    public Long getTotalPostLikes(@PathVariable Long userId) {
        return myPagePostService.getTotalPostLikes(userId);
    }

    // 특정 사용자의 게시글 총합
    @GetMapping("/count/{userId}")
    public Long getTotalPostCount(@PathVariable Long userId) {
        return postService.getTotalPostCount(userId);
    }


    // userId에 해당하는 최신 PUBLISHED 게시글 가져오기
    @GetMapping("/latest/{userId}")
    public ResponseEntity<PostResponseDto> getLatestPublishedPostByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getLatestPublishedPostByUserId(userId));
    }

}
