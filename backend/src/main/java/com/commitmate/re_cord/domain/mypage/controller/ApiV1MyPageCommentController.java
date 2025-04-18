package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.service.MyPageCommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
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
@RequestMapping("api/mypage/comments")

public class ApiV1MyPageCommentController {

    private final CommentService commentService;
    private final MyPageCommentService myPageCommentService;


    //user의 작성 댓글 일람
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }

    //댓글의 좋아요 총합
    @GetMapping("/likes/total")
    public long getTotalCommentsLikes(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        return myPageCommentService.getTotalCommentLikes(userId);
    }

    // 댓글을 좋아요 순으로 정렬
    @GetMapping("/likes/ordered")
    public ResponseEntity<List<CommentDTO>> getCommentsOrderByLikes(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<CommentDTO> comments = myPageCommentService.getCommentsOrderedByLikes(userId);
        return ResponseEntity.ok(comments);
    }
}
