package com.commitmate.re_cord.domain.mypage.controller;


import com.commitmate.re_cord.domain.mypage.service.MyPageUserService;
import com.commitmate.re_cord.domain.user.user.dto.UpdateUserDTO;
import com.commitmate.re_cord.global.config.S3Service;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/mypage")
@RequiredArgsConstructor
public class ApiV1MyPageUserController {

    private final MyPageUserService myPageUserService;
    private final S3Service s3Service;


    @GetMapping("/users")
    public ResponseEntity<UpdateUserDTO> getUserInfo(@AuthenticationPrincipal SecurityUser userDetails) {
        Long userId = userDetails.getId();
        UpdateUserDTO userInfo = myPageUserService.getUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }

    @Operation(
            summary = "유저 정보 변경"
    )
    //유저의 세부 정보 변경
    @PutMapping("/updateUsers")
    public ResponseEntity<UpdateUserDTO> updateUser(
        @AuthenticationPrincipal SecurityUser userDetails,
         @RequestBody UpdateUserDTO updateUserDTO) {

        Long userId = userDetails.getId();
        UpdateUserDTO updatedUser = myPageUserService.updateUser(userId, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(
            @AuthenticationPrincipal SecurityUser userDetails,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Long userId = userDetails.getId(); // 로그인한 유저 ID 가져오기
        String fileUrl = s3Service.uploadImage(file, userId); // S3 업로드
        return ResponseEntity.ok(fileUrl); // 파일 URL 리턴
    }

}
