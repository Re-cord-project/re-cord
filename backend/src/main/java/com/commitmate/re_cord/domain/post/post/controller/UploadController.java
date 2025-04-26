package com.commitmate.re_cord.domain.post.post.controller;

import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.global.config.S3Service;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UploadController {

    private final PostService postService;
    private final S3Service s3Service;

    @PostMapping("/{postId}/images")
    public ResponseEntity<?> uploadPostImages(
            @PathVariable Long postId,
            @RequestPart List<MultipartFile> images,
            @AuthenticationPrincipal SecurityUser userPrincipal) {
        try {
            postService.uploadPostImages(postId, images, userPrincipal.getId());
            return ResponseEntity.ok("이미지 업로드 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("업로드 실패: " + e.getMessage());
        }
    }

}
