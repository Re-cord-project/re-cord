package com.commitmate.re_cord.domain.post.comment.commentVote.repository;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.comment.commentVote.entity.CommentVote;
import com.commitmate.re_cord.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentVoteRepository extends JpaRepository<CommentVote, Long> {
    Optional<CommentVote> findByUserAndComment(User user, Comment comment);

}
