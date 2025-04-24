package com.commitmate.re_cord.domain.post.comment.comment.dto;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String createdAt;
    private String updateStatus;
    private String profileImageUrl;
    private int likes;
    private Long parentId;
    private List<CommentResponseDTO> replies;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent(); //Soft Delete
        this.username = comment.getUser().getUsername();
        this.createdAt = comment.getCreatedAt().toString();
        this.updateStatus = comment.getUpdateStatus().name();
        this.profileImageUrl = comment.getUser().getProfileImageUrl();
        this.likes = comment.getLikes();
        this.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        this.replies = new ArrayList<>();
    }
}
