package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.service.MyPageCommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/mypage/comments")

public class ApiV1MyPageCommentController {

    private final MyPageCommentService myPageCommentService;


    //user의 작성 댓글 일람
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<CommentDTO> comments = myPageCommentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/likes")
    public ResponseEntity<?> getCommentsLikes (
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(required = false) String type) {
        Long userId = userDetails.getId();
        switch (type) {
            case "total":
                return ResponseEntity.ok(myPageCommentService.getTotalCommentLikes(userId));
            case "ordred":
                List<CommentDTO> comments = myPageCommentService.getCommentsOrderedByLikes(userId);
                return ResponseEntity.ok(comments);
            default:
                return ResponseEntity.badRequest().body("Invalid query parameter");
        }
    }
}
