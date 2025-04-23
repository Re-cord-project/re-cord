package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.commentVote.service.CommentVoteService;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("api/posts/{postId}/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;
    private final CommentVoteService commentVoteService;

    @Operation(
            summary = "댓글 작성"
    )
    @PostMapping
    public ResponseEntity<CommentResponseDTO> registerComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDTO requestDTO,
            @AuthenticationPrincipal SecurityUser userDetails
            ){
        Long userId = userDetails.getId();

        CommentResponseDTO response = commentService.registerComment(requestDTO,postId,userId);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "댓글 삭제"
    )
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        commentService.deleteComment(commentId,userId);

        return ResponseEntity.ok(Map.of("message","댓글이 삭제되었습니다."));

    }

    @Operation(
            summary = "댓글 좋아요 누르기"
    )
    @PostMapping("/{commentId}/likes")
    public ResponseEntity<Void> toggleCommentLike(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        commentVoteService.toggleCommentLike(postId, commentId, userId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "댓글 수정"
    )
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDTO requestDTO,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        CommentResponseDTO response = commentService.updateComment(requestDTO,postId,userId,commentId);
        return ResponseEntity.ok(response);

    }

    @Operation(
            summary = "댓글 조회"
    )
    @GetMapping
    public Page<CommentResponseDTO> getComment(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){


        return commentService.getCommentByPostId(postId,page,size);
    }


}