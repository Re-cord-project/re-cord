package com.commitmate.re_cord.domain.post.comment.comment.dto;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//@Getter
//@AllArgsConstructor
//@NoArgsConstructor
//public class CommentResponseDTO {
//    private Long id;
//    private String content;
//    private String username;
//    private String createdAt;
//
//    public CommentResponseDTO(Comment comment) {
//        this.id = comment.getId();
//        this.content = comment.getContent();
//        this.username = comment.getUser().getUsername();
//        this.createdAt = comment.getCreatedAt().toString();
//    }
//}

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String createdAt;
    private String updateStatus;
    private String profileImageUrl;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.username = comment.getUser().getUsername();
        this.createdAt = comment.getCreatedAt().toString();
        this.updateStatus = comment.getUpdateStatus().name();
        this.profileImageUrl = comment.getUser().getProfileImageUrl();
    }
}
