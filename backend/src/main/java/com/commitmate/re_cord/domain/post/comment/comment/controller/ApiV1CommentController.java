package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.DTO.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.DTO.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;

    @PostMapping("/{postId}/{userId}")
    public ResponseEntity<CommentResponseDTO> registerComment(
            @PathVariable Long postId,
            @PathVariable Long userId,
            @RequestBody CommentRequestDTO requestDTO
            ){

        CommentResponseDTO response = commentService.registerComment(requestDTO,postId,userId);
        return ResponseEntity.ok(response);
    }
}
