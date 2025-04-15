package com.commitmate.re_cord.domain.post.comment.comment.dto;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;
    private Long postId;
    private String postTitle;


    public static CommentDTO getEntity(Comment comment){
        return new CommentDTO(
                comment.getId(),
                comment.getUser().getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getPost().getId(),
                comment.getPost().getTitle()
        );
    }




}
