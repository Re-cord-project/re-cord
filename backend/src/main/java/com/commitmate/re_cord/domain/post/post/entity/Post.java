package com.commitmate.re_cord.domain.post.post.entity;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import jakarta.persistence.*;
import jakarta.persistence.PrePersist;
import lombok.*;
import lombok.experimental.SuperBuilder;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Post extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    private int views = 0;
    private int likes = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @Enumerated(EnumType.STRING)
    private UpdateStatus updateStatus;

    // 좋아요 증가 메서드
    public void increaseLikeCount() {
        this.likes++;
    }

    // 좋아요 감소 메서드
    public void decreaseLikeCount() {
        if (this.likes > 0) {
            this.likes--;
        }
    }

    // 엔티티가 저장되기 전에 호출되는 @PrePersist
    @PrePersist
    public void prePersist() {

        if (this.updateStatus == null) {
            this.updateStatus = UpdateStatus.NOT_EDITED;
        }
    }
}
