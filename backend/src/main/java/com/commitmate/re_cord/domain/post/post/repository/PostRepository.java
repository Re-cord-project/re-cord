package com.commitmate.re_cord.domain.post.post.repository;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findTopByUserAndStatusOrderByUpdatedAtDesc(User user, PostStatus status);
    // 카테고리와 삭제되지 않은 포스트를 찾는 메서드
    Page<Post> findAllByCategoryIdAndUpdateStatusNot(Long categoryId, UpdateStatus updateStatus, Pageable pageable);

    // 제목, 내용, 작성자 이름을 기준으로 검색하되, 삭제되지 않은 포스트만 필터링하는 메서드
    Page<Post> findByUpdateStatusNotAndTitleContainingIgnoreCaseOrUpdateStatusNotAndContentContainingIgnoreCaseOrUpdateStatusNotAndUser_UsernameContainingIgnoreCase(
            UpdateStatus updateStatus, String title, UpdateStatus updateStatus2, String content, UpdateStatus updateStatus3, String username, Pageable pageable);

    // 삭제되지 않은 모든 포스트를 찾는 메서드
    Page<Post> findAllByUpdateStatusNot(UpdateStatus updateStatus, Pageable pageable);

    List<Post> findAllByUpdateStatusAndUpdatedAtBefore(UpdateStatus status, LocalDateTime time);


}