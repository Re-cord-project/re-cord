package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostResponseDto {

    private Long id;
    private String title;
    private String content;
    private String categoryName;
    private String username;
    private int views;
    private int likes;
    private String status;
    private String updateStatus;
    private String createdAt;
    private String updatedAt;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.views = post.getViews();
        this.likes = post.getLikes();
        this.categoryName = post.getCategory() != null ? post.getCategory().getName() : null;
        this.username = post.getUser() != null ? post.getUser().getUsername() : null;

        // Enum 값을 안전하게 변환 (값이 없으면 null 처리)
        this.status = getEnumName(post.getStatus());
        this.updateStatus = getEnumName(post.getUpdateStatus());

        this.createdAt = post.getCreatedAt() != null ? post.getCreatedAt().toString() : null;
        this.updatedAt = post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : null;
    }

    // Enum 값을 안전하게 변환하는 메서드
    private String getEnumName(Enum<?> enumValue) {
        return enumValue != null ? enumValue.name() : null;
    }
}
