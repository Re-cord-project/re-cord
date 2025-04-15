package com.commitmate.re_cord.domain.post.post.entity;

import com.commitmate.re_cord.domain.user.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "post_like", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "post_id"})
})
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected PostLike() {}

    public PostLike(Post post, User user) {
        this.post = post;
        this.user = user;
    }
}
