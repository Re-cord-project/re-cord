package com.commitmate.re_cord.domain.post.post.dto;

import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdatePostStatusRequest {
    private PostStatus status;
    private boolean isTemp;
}
