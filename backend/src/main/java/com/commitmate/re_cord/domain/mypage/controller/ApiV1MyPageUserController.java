package com.commitmate.re_cord.domain.mypage.controller;


import com.commitmate.re_cord.domain.mypage.service.MyPageUserService;
import com.commitmate.re_cord.domain.user.user.dto.UpdateUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class ApiV1MyPageUserController {

    private final MyPageUserService myPageUserService;

    //유저의 세부 정보 변경
    @PutMapping("/{userId}/userUpdate")
    public ResponseEntity<UpdateUserDTO> updateUser(@PathVariable("userId") Long userId, @RequestBody UpdateUserDTO updateUserDTO) {
        UpdateUserDTO updatedUser = myPageUserService.updateUser(userId, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }
}
