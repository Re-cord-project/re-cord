package com.commitmate.re_cord.domain.post.post.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter // 이게 있으면 따로 추가 안 해도 돼
@NoArgsConstructor
@SuperBuilder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    private String fileKey;

    // 또는 수동으로
    public void setUrl(String url) {
        this.imageUrl = url;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public String getUrl() {
        return imageUrl;  // S3에서 저장된 이미지 URL 반환
    }
}
