package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class PostRequestDto {

    private String title;

    private String content;

    private Long categoryId;

    private PostStatus status;

    private Long userId;  // 유저 ID 추가

    private MultipartFile[] images; // 이미지를 MultipartFile 배열로 받기
}
