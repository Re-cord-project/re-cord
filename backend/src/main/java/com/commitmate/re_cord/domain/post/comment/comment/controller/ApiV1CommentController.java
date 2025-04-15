package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/{postId}/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;

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


}