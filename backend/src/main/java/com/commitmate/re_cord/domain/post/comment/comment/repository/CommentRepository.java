package com.commitmate.re_cord.domain.post.comment.comment.repository;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {


    @Query("SELECT c FROM Comment c JOIN FETCH c.post p JOIN FETCH p.user WHERE c.user.id = :userId")
    Page <Comment> findMyComment(@Param("userId") Long userId, Pageable pageable);


    @Query("SELECT SUM(p.likes) FROM Comment p WHERE p.user.id = :userId")
    Long totalCommentLikes(@Param("userId")Long userId);

    @Query("SELECT p FROM Comment p WHERE p.user.id =:userId ORDER BY p.likes DESC")
    Page<Comment> orderCommentsByLikes(@Param("userId")Long userId,Pageable pageable);

    Page<Comment> findByPostId(Long postId, Pageable pageable);
    Page<Comment> findByPostIdAndParentIsNull(Long postId, Pageable pageable);
    List<Comment> findByPostIdAndParentIsNotNull(Long postId);

}