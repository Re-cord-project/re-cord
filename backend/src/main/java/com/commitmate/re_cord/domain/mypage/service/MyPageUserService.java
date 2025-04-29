package com.commitmate.re_cord.domain.mypage.service;

import com.commitmate.re_cord.domain.user.user.dto.UpdateUserDTO;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.config.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyPageUserService {

    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Transactional(readOnly = true)
    public UpdateUserDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        return UpdateUserDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .bootcamp(user.getBootcamp())
                .generation(user.getGeneration())
                .introduction(user.getIntroduction())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }



    @Transactional
    public UpdateUserDTO updateUser(Long userId, UpdateUserDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        // 닉네임 중복 체크
        if (userRepository.existsByUsernameAndIdNot(dto.getUsername(), userId)) {
            throw new IllegalArgumentException("이미 사용 중인 이름입니다.");
        }
        // 이메일 중복 체크
        if (userRepository.existsByEmailAndIdNot(dto.getEmail(), userId)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 업데이트할 값 설정
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setGeneration(dto.getGeneration());
        user.setBootcamp(dto.getBootcamp());
        user.setIntroduction(dto.getIntroduction());
        user.setProfileImageUrl(dto.getProfileImageUrl()); // profileImageUrl 추가
        // 유저 정보 저장
        userRepository.save(user);
        return dto;
    }

    public String updateProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id=" + userId));

        // 기존 이미지 삭제 (선택)
        if (user.getProfileImageUrl() != null) {
            s3Service.delete(user.getProfileImageUrl());
        }

        // 프로필 이미지 업로드 (userId 경로 사용)
        String imageUrl;
        try {
            imageUrl = s3Service.uploadImage(file, userId);
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 업로드 실패", e);
        }

        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }


}
