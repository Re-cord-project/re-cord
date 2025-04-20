package com.commitmate.re_cord.domain.mypage.service;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MyPageCommentService {
    private final CommentRepository commentRepository;


    public List<CommentDTO> getCommentsByUserId(Long userId) {
        return commentRepository.findMyComment(userId).stream()
                .map(CommentDTO::getEntity)
                .collect(Collectors.toList());
    }

    // 댓글 좋아요 총합
    public Long getTotalCommentLikes(Long userId){
        return commentRepository.totalCommentLikes(userId);
    }

    // 댓글 좋아요 순 정렬
    public List<CommentDTO> getCommentsOrderedByLikes(Long userId){
        return commentRepository.orderCommentsByLikes(userId).stream()
                .map(CommentDTO::getEntity)
                .collect(Collectors.toList());
    }
}
