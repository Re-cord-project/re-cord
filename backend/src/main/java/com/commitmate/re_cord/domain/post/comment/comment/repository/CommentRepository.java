package com.commitmate.re_cord.domain.post.comment.comment.repository;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT p FROM Comment p WHERE p.user.id = :userId")
    List<Comment> findMyComment(@Param("userId") Long userId);

    @Query("SELECT SUM(p.likes) FROM Comment p WHERE p.user.id = :userId")
    Long totalCommentLikes(@Param("userId")Long userId);

    @Query("SELECT p FROM Comment p WHERE p.user.id =:userId ORDER BY p.likes DESC")
    List<CommentDTO> orderCommentsByLikes(@Param("userId")Long userId);




}
