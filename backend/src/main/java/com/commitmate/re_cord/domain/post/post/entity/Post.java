package com.commitmate.re_cord.domain.post.post.entity;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.BaseEntity;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

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

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false) // MySQL, PostgreSQL 등에선 이거
    private String content;


    private int views = 0;
    private int likes = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @Enumerated(EnumType.STRING)
    private UpdateStatus updateStatus;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude // ToString 무한 루프 방지
    private List<Image> images = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<PostLike> postLikes = new ArrayList<>();

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

    @PrePersist
    public void prePersist() {
        if (this.updateStatus == null) {
            this.updateStatus = UpdateStatus.NOT_EDITED;
        }
        // 게시글 상태가 PUBLISHED일 때만 카테고리 postCount 증가
        if (this.category != null && this.status == PostStatus.PUBLISHED) {
            this.category.setPostCount(this.category.getPostCount() + 1);
        }
    }

    @PreRemove
    public void preRemove() {
        // 게시글 상태가 PUBLISHED였다면 카테고리 postCount 감소
        if (this.category != null && this.status == PostStatus.PUBLISHED) {
            this.category.setPostCount(this.category.getPostCount() - 1);
        }
    }

    @PostLoad
    public void postLoad() {
        if (this.updateStatus == null) {
            this.updateStatus = UpdateStatus.NOT_EDITED;
        }
    }

    // 게시글 상태를 업데이트하는 메서드 (soft delete를 위한)
    public void updateStatus(PostStatus status) {
        // 상태가 PUBLISHED에서 다른 상태로 변경될 때 postCount 감소
        if (this.status == PostStatus.PUBLISHED && status != PostStatus.PUBLISHED && this.category != null) {
            this.category.setPostCount(this.category.getPostCount() - 1);
        }
        // 상태가 다른 상태에서 PUBLISHED로 변경될 때 postCount 증가
        else if (this.status != PostStatus.PUBLISHED && status == PostStatus.PUBLISHED && this.category != null) {
            this.category.setPostCount(this.category.getPostCount() + 1);
        }
        this.status = status;
    }
}