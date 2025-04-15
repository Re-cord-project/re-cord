package com.commitmate.re_cord.domain.post.comment.comment.repository;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
  
    @Query("SELECT p FROM Comment p WHERE p.user.id = :userId")
    List<Comment> findMyComment(@Param("userId") Long userId);
}
