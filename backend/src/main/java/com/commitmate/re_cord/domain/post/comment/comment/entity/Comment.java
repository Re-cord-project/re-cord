package com.commitmate.re_cord.domain.post.comment.comment.entity;

import com.commitmate.re_cord.domain.post.comment.commentVote.entity.CommentVote;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(exclude ={"user", "post"})
public class Comment extends BaseEntity {

    private int likes;
    private String content;

    @Column(nullable = false)
    private boolean deleted = false;


    @Enumerated(EnumType.STRING)
    private UpdateStatus updateStatus = UpdateStatus.NOT_EDITED;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @OneToMany(mappedBy = "comment",cascade = CascadeType.REMOVE)
    private List<CommentVote> commentVotes;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent; //대댓글-부모댓글 필드 추가


    public void increaseLikeCount(){
        this.likes++;
    }

    public void decreaseLikeCount(){
        if(this.likes>0){
            this.likes--;
        }
    }

    public Comment(int likes, String content, UpdateStatus updateStatus, User user, Post post, Comment parent) {
        this.likes = likes;
        this.content = content;
        this.updateStatus = updateStatus;
        this.user = user;
        this.post = post;
        this.parent = parent;
    }


}