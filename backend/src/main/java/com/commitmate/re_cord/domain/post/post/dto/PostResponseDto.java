package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class PostResponseDto {

    private Long id;
    private String title;
    private String content;
    private String categoryName;
    private String username;
    private Long userId;  // 작성자 ID 추가
    private int views;
    private int likes;
    private String status;
    private String updateStatus;
    private String createdAt;
    private String updatedAt;

    // ✅ 이미지 URL 리스트 추가
    private List<String> imageUrls;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.views = post.getViews();
        this.likes = post.getLikes();
        this.categoryName = post.getCategory() != null ? post.getCategory().getName() : null;
        this.username = post.getUser() != null ? post.getUser().getUsername() : null;

        // 작성자 ID 추가
        this.userId = post.getUser() != null ? post.getUser().getId() : null;

        this.status = getEnumName(post.getStatus());
        this.updateStatus = getEnumName(post.getUpdateStatus());

        this.createdAt = post.getCreatedAt() != null ? post.getCreatedAt().toString() : null;
        this.updatedAt = post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : null;

        // ✅ 이미지 URL 리스트 추출
        this.imageUrls = post.getImages().stream()
                .map(image -> image.getUrl())
                .collect(Collectors.toList());
    }

    private String getEnumName(Enum<?> enumValue) {
        return enumValue != null ? enumValue.name() : null;
    }
}
