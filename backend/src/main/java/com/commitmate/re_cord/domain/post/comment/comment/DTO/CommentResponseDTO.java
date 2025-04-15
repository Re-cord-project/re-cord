package com.commitmate.re_cord.domain.post.comment.comment.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String createdAt;
}
