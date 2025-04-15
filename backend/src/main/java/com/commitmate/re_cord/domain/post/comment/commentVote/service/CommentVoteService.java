package com.commitmate.re_cord.domain.post.comment.commentVote.service;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.post.comment.commentVote.entity.CommentVote;
import com.commitmate.re_cord.domain.post.comment.commentVote.repository.CommentVoteRepository;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentVoteService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentVoteRepository commentVoteRepository;

    @Transactional
    public void toggleCommentLike(Long postId, Long commentId, Long userId){
        Post post = postRepository.findById(postId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 게시글입니다."));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 댓글입니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 유저입니다."));

        Optional<CommentVote> isLike = commentVoteRepository.findByUserAndComment(user,comment);


        if(isLike.isPresent()){
            commentVoteRepository.delete(isLike.get()); //좋아요 취소
            comment.decreaseLikeCount(); //추천 수 감소
        }else{
            CommentVote commentVote = new CommentVote(user, comment);
            commentVoteRepository.save(commentVote);
            comment.increaseLikeCount();
        }
        commentRepository.save(comment); //좋아요 수 저장


    }
}
