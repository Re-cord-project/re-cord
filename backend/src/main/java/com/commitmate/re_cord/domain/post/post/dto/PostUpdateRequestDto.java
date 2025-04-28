package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
public class PostUpdateRequestDto {

    private String title;

    private String content;

    private Long categoryId;

    private PostStatus status;

    // 새로운 이미지를 업데이트하기 위한 필드
    private List<MultipartFile> newImages;  // 새로 추가될 이미지들

    // 기존 이미지를 삭제하려면 파일 URL 목록을 받는 것도 가능
    private List<String> imageUrlsToDelete;  // 삭제할 이미지 URL 리스트

    private List<String> updatedImageUrls;
}
