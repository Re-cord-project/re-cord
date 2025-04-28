package com.commitmate.re_cord.domain.home.dto;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HomeDto {
    private Long id;
    private String title;
    private String thumbnailUrl;
    private String username;
    private int likes;
    private String createdAt;

    public static HomeDto from(Post post) {
        return new HomeDto(
                post.getId(),
                post.getTitle(),
                post.getImages().isEmpty() ? null : post.getImages().get(0).getImageUrl(),
                post.getUser().getUsername(),
                post.getLikes(),
                post.getCreatedAt().toString() // 포맷 원하면 포맷팅 추가 가능
        );
    }

}
