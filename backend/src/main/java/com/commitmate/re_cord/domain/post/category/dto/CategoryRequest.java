package com.commitmate.re_cord.domain.post.category.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoryRequest {

    private String name;

    // 생성자, 유효성 검사를 위한 어노테이션도 추가 가능
    public CategoryRequest(String name) {
        this.name = name;
    }
}
