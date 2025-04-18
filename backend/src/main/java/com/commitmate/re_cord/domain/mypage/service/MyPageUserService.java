package com.commitmate.re_cord.domain.mypage.service;

import com.commitmate.re_cord.domain.user.user.dto.UpdateUserDTO;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyPageUserService {

    private final UserRepository userRepository;

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

        // 유저 정보 저장
        userRepository.save(user);

        return dto;
    }
}
