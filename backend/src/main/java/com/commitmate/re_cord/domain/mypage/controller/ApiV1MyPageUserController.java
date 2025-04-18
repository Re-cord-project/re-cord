package com.commitmate.re_cord.domain.mypage.controller;


import com.commitmate.re_cord.domain.mypage.service.MyPageUserService;
import com.commitmate.re_cord.domain.user.user.dto.UpdateUserDTO;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/mypage")
@RequiredArgsConstructor
public class ApiV1MyPageUserController {

    private final MyPageUserService myPageUserService;

    //유저의 세부 정보 변경
    @PutMapping("/userUpdate")
    public ResponseEntity<UpdateUserDTO> updateUser(
            @AuthenticationPrincipal SecurityUser userDetails,
        @RequestBody UpdateUserDTO updateUserDTO) {
        Long userId = userDetails.getId();
        UpdateUserDTO updatedUser = myPageUserService.updateUser(userId, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }
}
