package com.commitmate.re_cord.domain.post.post.repository;

import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface PostRepository extends JpaRepository<Post,Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId")
    List<Post> findMyPost(@Param("userId") Long userId);


    // 조회수 총합
    @Query("SELECT SUM(p.views) FROM Post p WHERE p.user.id = :userId")
    Long totalPostViews(@Param("userId") Long userId);

    //게시글 추천 총합
    @Query("SELECT SUM(p.likes) FROM Post p WHERE p.user.id = :userId")
    Long totalPostLikes(@Param("userId")Long userId);


    //조회수 순 게시글 정렬
    @Query("SELECT p FROM Post p WHERE p.user.id =:userId ORDER BY p.views DESC")
    List<Post> orderPostsByViews(@Param("userId")Long userId);

    //좋아요 순 게시글 정렬
    @Query("SELECT p FROM Post p WHERE p.user.id =:userId ORDER BY p.likes DESC")
    List<Post> orderPostsByLikes(@Param("userId")Long userId);


    //월별 조회수 통계


    // mysql 용
//    @Query(value = "SELECT DATE_FORMAT(p.createdAt, '%Y-%m') AS month, SUM(p.views) AS totalViews " +
//            "FROM post p WHERE p.user_id = :userId " +
//            "GROUP BY DATE_FORMAT(p.createdAt, '%Y-%m') " +
//            "ORDER BY DATE_FORMAT(p.createdAt, '%Y-%m')",
//            nativeQuery = true)


    @Query(value = "SELECT FORMATDATETIME(p.created_at, 'yyyy-MM') AS \"month\", SUM(p.views) AS totalViews " +
            "FROM post p WHERE p.user_id = :userId " +
            "GROUP BY FORMATDATETIME(p.created_at, 'yyyy-MM') " +
            "ORDER BY FORMATDATETIME(p.created_at, 'yyyy-MM')",
            nativeQuery = true)

    List<Object[]> getMonthlyViews(@Param("userId") Long userId);

    
    Optional<Post> findTopByUserAndStatusOrderByUpdatedAtDesc(User user, PostStatus status);
    // 카테고리와 PUBLISHED 인 게시글만 보는 메서드
    Page<Post> findAllByCategoryIdAndUpdateStatus(Long categoryId, UpdateStatus updateStatus, Pageable pageable);

    // 제목, 내용, 작성자 이름을 기준으로 검색하되, 삭제되지 않은 포스트만 필터링하는 메서드
    @Query("""
    SELECT p FROM Post p
    WHERE p.updateStatus = 'EDITED'
      AND (
        LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(p.user.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
      )
""")
    Page<Post> searchVisiblePosts(@Param("keyword") String keyword, Pageable pageable);


    // 삭제되지 않은 모든 포스트를 찾는 메서드
    Page<Post> findAllByUpdateStatus(UpdateStatus updateStatus, Pageable pageable);

    List<Post> findAllByUpdateStatusAndUpdatedAtBefore(UpdateStatus status, LocalDateTime time);

}
