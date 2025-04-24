package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.service.MyPageCommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Page import 추가


@RestController
@RequiredArgsConstructor
@RequestMapping("api/mypage/comments")

public class ApiV1MyPageCommentController {

    private final MyPageCommentService myPageCommentService;


    //user의 작성 댓글 일람
    @GetMapping
    public ResponseEntity<Page<CommentDTO>> getCommentsByUser(
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
            ){

        Long userId = userDetails.getId();
        Page<CommentDTO> comments = myPageCommentService.getCommentsByUserIdByDesc(userId,page,size);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/likes")
    public ResponseEntity<?> getCommentsLikes (
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {         
                
        Long userId = userDetails.getId();
        
        switch (type) {
            case "total":
                return ResponseEntity.ok(myPageCommentService.getTotalCommentLikes(userId));
            case "ordered":
                Page<CommentDTO> comments = myPageCommentService.getCommentsOrderedByLikes(userId,page,size);
                return ResponseEntity.ok(comments);
            default:
                return ResponseEntity.badRequest().body("Invalid query parameter");
        }
    }
}
