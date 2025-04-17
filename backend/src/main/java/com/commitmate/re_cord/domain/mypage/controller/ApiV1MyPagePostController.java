package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.mypage.service.MyPagePostService;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/posts")

public class ApiV1MyPagePostController {
    private final PostService postService;
    private final MyPagePostService myPagePostService;

    @GetMapping
    public ResponseEntity<List<PostDTO>> getPostsByUser(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    // 게시글의 조회수 총합
    @GetMapping("/views/total")
    public ResponseEntity<Long> getTotalPostsViews(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        Long totalViews = myPagePostService.getTotalPostViews(userId);
        return ResponseEntity.ok(totalViews);
    }

    //게시글의 좋아요 총합
    @GetMapping("/likes/total")
    public long getTotalPostsLikes(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        return myPagePostService.getTotalPostLikes(userId);
    }

    //게시글을 조회수 순으로 정렬
    @GetMapping("/views/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByViews(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<PostDTO> posts = myPagePostService.getPostsOrderedByViews(userId);
        return ResponseEntity.ok(posts);
    }

    //게시글을 좋아요 순으로 정렬
    @GetMapping("/likes/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByLikes(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<PostDTO> posts = myPagePostService.getPostsOrderedByLikes(userId);
        return ResponseEntity.ok(posts);
    }

    // 포스트 월별 조회수 통계(그래프용)
    @GetMapping("/views/monthly")
    public ResponseEntity<List<MonthlyViewDTO>> getMonthlyViewStats(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<MonthlyViewDTO> stats = myPagePostService.getMonthlyViewStats(userId);
        return ResponseEntity.ok(stats);
    }
}
