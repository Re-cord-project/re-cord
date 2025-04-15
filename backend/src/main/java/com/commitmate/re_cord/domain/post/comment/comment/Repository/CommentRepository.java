package com.commitmate.re_cord.domain.post.comment.comment.Repository;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

}
