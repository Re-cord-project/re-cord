package com.commitmate.re_cord.domain.mypage.controller;

import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.mypage.service.MyPagePostService;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/mypage/posts")

public class ApiV1MyPagePostController {
    private final PostService postService;
    private final MyPagePostService myPagePostService;

    @GetMapping
    public ResponseEntity<List<PostDTO>> getPostsByUser(
            @AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    // 게시글의 조회수
    @GetMapping("/views")
    public ResponseEntity<?> getPostsViews(
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam(required = false) String type) {
        Long userId = userDetails.getId();
        switch (type) {
            case "total":
                return ResponseEntity.ok(myPagePostService.getTotalPostViews(userId));
            case "ordered":
                List<PostDTO> posts = myPagePostService.getPostsOrderedByViews(userId);
                return ResponseEntity.ok(posts);
            case "monthly":
                List<MonthlyViewDTO> stats = myPagePostService.getMonthlyViewStats(userId);
                return ResponseEntity.ok(stats);
            default:
                return ResponseEntity.badRequest().body("Invalid query parameter");
        }
    }

        @GetMapping("/likes")
        public ResponseEntity<?> getPostsLikes (
                @AuthenticationPrincipal SecurityUser userDetails,
                @RequestParam(required = false) String type){
            Long userId = userDetails.getId();
            switch (type) {
                case "total":
                    return ResponseEntity.ok(myPagePostService.getTotalPostLikes(userId));
                case "ordered":
                    List<PostDTO> posts = myPagePostService.getPostsOrderedByViews(userId);
                    return ResponseEntity.ok(posts);
                case "monthly":
                    List<MonthlyViewDTO> stats = myPagePostService.getMonthlyViewStats(userId);
                    return ResponseEntity.ok(stats);
                default:
                    return ResponseEntity.badRequest().body("Invalid query parameter");
            }

        }
    }

