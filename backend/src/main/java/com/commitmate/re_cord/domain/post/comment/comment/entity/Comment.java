package com.commitmate.re_cord.domain.post.comment.comment.entity;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(exclude ={"user", "post"})
public class Comment extends BaseEntity {

    private int likes;
    private String content;

    @Enumerated(EnumType.STRING)
    private UpdateStatus updateStatus = UpdateStatus.NOT_EDITED;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    public void increaseLikeCount(){
        this.likes++;
    }

    public void decreaseLikeCount(){
        if(this.likes>0){
            this.likes--;
        }
    }

}