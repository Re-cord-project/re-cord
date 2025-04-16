package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.mypage.service.MyPageService;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class ApiV1MypageController {

    private final PostService postService;
    private final CommentService commentService;

    private final MyPageService myPageService;


    @GetMapping("/posts/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/comments/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable("userId") Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }

    // 게시글의 조회수 총합
    @GetMapping("/posts/{userId}/views/total")
    public ResponseEntity<Long> getTotalPostsViews(@PathVariable("userId") Long userId) {

        Long totalViews = myPageService.getTotalPostViews(userId);
        return ResponseEntity.ok(totalViews);
    }

    //게시글의 좋아요 총합
    @GetMapping("/posts/{userId}/likes/total")

    public long getTotalPostsLikes(@PathVariable("userId") Long userId) {
        return myPageService.getTotalPostLikes(userId);
    }

    //댓글의 좋아요 총합
    @GetMapping("/comments/{userId}/likes/total")

    public long getTotalCommentsLikes(@PathVariable("userId") Long userId) {
        return myPageService.getTotalCommentLikes(userId);
    }


    //게시글을 조회수 순으로 정렬
    @GetMapping("/posts/{userId}/views/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByViews(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = myPageService.getPostsOrderedByViews(userId);
        return ResponseEntity.ok(posts);
    }


    //게시글을 좋아요 순으로 정렬
    @GetMapping("/posts/{userId}/likes/ordered")
    public ResponseEntity<List<PostDTO>> getPostsOrderByLikes(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = myPageService.getPostsOrderedByLikes(userId);
        return ResponseEntity.ok(posts);
    }


    // 댓글을 좋아요 순으로 정렬
    @GetMapping("/comments/{userId}/likes/ordered")
    public ResponseEntity<List<CommentDTO>> getCommentsOrderByLikes(@PathVariable("userId") Long userId) {
        List<CommentDTO> comments = myPageService.getCommentsOrderedByLikes(userId);
        return ResponseEntity.ok(comments);
    }

    // 포스트 월별 조회수 통계(그래프용)
    @GetMapping("/posts/{userId}/views/monthly")
    public ResponseEntity<List<MonthlyViewDTO>> getMonthlyViewStats(@PathVariable("userId") Long userId) {
        List<MonthlyViewDTO> stats = myPageService.getMonthlyViewStats(userId);
        return ResponseEntity.ok(stats);
    }
}






