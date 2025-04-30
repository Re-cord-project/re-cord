package com.commitmate.re_cord.domain.post.post.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url") // 명시적으로 컬럼명 매핑 및 NOT NULL 설정 (필요하다면)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id") // post_id는 외래 키이므로 NOT NULL 설정
    private Post post;

    private String fileKey;

}