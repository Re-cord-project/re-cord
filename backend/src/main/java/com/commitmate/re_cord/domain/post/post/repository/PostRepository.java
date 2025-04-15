package com.commitmate.re_cord.domain.post.post.repository;

import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {

    //userId 별 post
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
    List<PostDTO> orderPostsByViews(@Param("userId")Long userId);

    //좋아요 순 게시글 정렬
    @Query("SELECT p FROM Post p WHERE p.user.id =:userId ORDER BY p.likes DESC")
    List<PostDTO> orderPostsByLikes(@Param("userId")Long userId);


}
