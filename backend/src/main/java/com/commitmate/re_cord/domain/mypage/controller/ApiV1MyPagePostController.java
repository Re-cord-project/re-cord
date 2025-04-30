package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.mypage.service.MyPagePostService;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page; // Page import 추가

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/mypage/posts")

public class ApiV1MyPagePostController {

    private final MyPagePostService myPagePostService;

    @Operation(
            summary = "내 게시글 시간순 조회"
    )
    @GetMapping
    public ResponseEntity<Page<PostDTO>> getPostsByUser(
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Long userId = userDetails.getId();
        Page<PostDTO> posts = myPagePostService.getPostsByUserIdByDesc(userId,page,size);
        return ResponseEntity.ok(posts);
    }

    // 게시글의 조회수
    @GetMapping("/views")
    public ResponseEntity<?> getPostsViews(
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) { 

        Long userId = userDetails.getId();
        switch (type) {
            case "total":
                return ResponseEntity.ok(myPagePostService.getTotalPostViews(userId));
            case "ordered":
                Page<PostDTO> posts = myPagePostService.getPostsOrderedByViews(userId,page, size);
                return ResponseEntity.ok(posts);
            case "monthly":
                List<MonthlyViewDTO> stats = myPagePostService.getMonthlyViewStats(userId);
                return ResponseEntity.ok(stats);
            default:
                return ResponseEntity.badRequest().body("Invalid query parameter");
        }
    }

    // 게시글의 좋아요
    @GetMapping("/likes")
    public ResponseEntity<?> getPostsLikes (
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size){
        Long userId = userDetails.getId();

        switch (type) {
            case "total":
                return ResponseEntity.ok(myPagePostService.getTotalPostLikes(userId));
            case "ordered":
                Page<PostDTO> posts = myPagePostService.getPostsOrderedByLikes(userId,page, size);
                return ResponseEntity.ok(posts);
            default:
                return ResponseEntity.badRequest().body("Invalid query parameter");
        }
    }
  }

