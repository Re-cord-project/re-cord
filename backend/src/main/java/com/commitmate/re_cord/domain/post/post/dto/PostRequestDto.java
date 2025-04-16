package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import lombok.Getter;

@Getter
public class PostRequestDto {

    private String title;

    private String content;

    private Long categoryId;

    private PostStatus status;
}
