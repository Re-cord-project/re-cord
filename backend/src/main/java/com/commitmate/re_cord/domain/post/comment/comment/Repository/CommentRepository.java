package com.commitmate.re_cord.domain.post.comment.comment.Repository;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT p FROM Comment p WHERE p.user.id = :userId")
    List<Comment> findMyComment(@Param("userId") Long userId);
}
