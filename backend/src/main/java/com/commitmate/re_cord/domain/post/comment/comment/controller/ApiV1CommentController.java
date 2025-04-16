package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.commentVote.service.CommentVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/{postId}/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;
    private final CommentVoteService commentVoteService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<CommentResponseDTO> registerComment(
            @PathVariable Long postId,
            @PathVariable Long userId,
            @RequestBody CommentRequestDTO requestDTO
    ){

        CommentResponseDTO response = commentService.registerComment(requestDTO,postId,userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}/{commentId}")
    public void deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @PathVariable Long userId
    ){
        commentService.deleteComment(commentId,userId);

    }

    @PostMapping("/{commentId}/like/user/{userId}")
    public ResponseEntity<Void> toggleCommentLike(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @PathVariable Long userId
    ){
        commentVoteService.toggleCommentLike(postId, commentId, userId);
        return ResponseEntity.ok().build();
    }


}