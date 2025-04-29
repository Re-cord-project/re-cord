package com.commitmate.re_cord.domain.home.controller;

import com.commitmate.re_cord.domain.home.dto.HomeDto;
import com.commitmate.re_cord.domain.home.service.HomeService;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home")
public class ApiV1HomeController {

    private final HomeService homeService;

    @GetMapping("")
    public ResponseEntity<String> homeRoot() {
        return ResponseEntity.ok("Welcome to Home API");
    }


    // 1. 최근 사진 있는 포스트 4개
    @GetMapping("/recent-posts")
    public ResponseEntity<List<HomeDto>> getRecentPosts() {
        List<HomeDto> posts = homeService.getRecentPostsWithImages();
        return ResponseEntity.ok(posts);
    }

    // 2. 이번 주 인기 포스트 4개
    @GetMapping("/weekly-popular")
    public ResponseEntity<List<HomeDto>> getWeeklyPopularPosts() {
        List<HomeDto> posts = homeService.getWeeklyPopularPosts();
        return ResponseEntity.ok(posts);
    }


    // 3. 부트캠프 별 인기 포스트 8개
    @GetMapping("/popular-posts")
    public ResponseEntity<List<HomeDto>> getPopularPostsByBootcamp(
            @RequestParam String bootcamp
    ) {
        List<HomeDto> posts = homeService.getPopularPostsByBootcamp(bootcamp);
        return ResponseEntity.ok(posts);
    }



}
