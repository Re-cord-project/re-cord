package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.mypage.service.MyPagePostService;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    // 게시글의 조회수 총합
    @GetMapping("/{userId}/views/total")
    public ResponseEntity<Long> getTotalPostsViews(@PathVariable("userId") Long userId) {

        Long totalViews = myPagePostService.getTotalPostViews(userId);
        return ResponseEntity.ok(totalViews);
    }

    //게시글의 좋아요 총합
    @GetMapping("/{userId}/likes/total")

    public long getTotalPostsLikes(@PathVariable("userId") Long userId) {
        return myPagePostService.getTotalPostLikes(userId);
    }

    //게시글을 조회수 순으로 정렬
    @GetMapping("/{userId}/views/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByViews(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = myPagePostService.getPostsOrderedByViews(userId);
        return ResponseEntity.ok(posts);
    }

    //게시글을 좋아요 순으로 정렬
    @GetMapping("/{userId}/likes/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByLikes(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = myPagePostService.getPostsOrderedByLikes(userId);
        return ResponseEntity.ok(posts);
    }

    // 포스트 월별 조회수 통계(그래프용)
    @GetMapping("/{userId}/views/monthly")
    public ResponseEntity<List<MonthlyViewDTO>> getMonthlyViewStats(@PathVariable("userId") Long userId) {
        List<MonthlyViewDTO> stats = myPagePostService.getMonthlyViewStats(userId);
        return ResponseEntity.ok(stats);
    }
}
