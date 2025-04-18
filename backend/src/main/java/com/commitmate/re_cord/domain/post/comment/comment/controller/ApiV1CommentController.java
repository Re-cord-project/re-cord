package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.commentVote.service.CommentVoteService;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/{postId}/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;
    private final CommentVoteService commentVoteService;

    @PostMapping("/new")
    public ResponseEntity<CommentResponseDTO> registerComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDTO requestDTO,
            @AuthenticationPrincipal SecurityUser userDetails
            ){
        Long userId = userDetails.getId();

        CommentResponseDTO response = commentService.registerComment(requestDTO,postId,userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}/delete")
    public void deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        commentService.deleteComment(commentId,userId);

    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> toggleCommentLike(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        commentVoteService.toggleCommentLike(postId, commentId, userId);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/{commentId}/edit")
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

    @GetMapping
    public Page<CommentResponseDTO> getComment(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){


        return commentService.getCommentByPostId(postId,page,size);
    }


}