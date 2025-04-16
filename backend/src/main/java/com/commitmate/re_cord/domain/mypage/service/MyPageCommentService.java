package com.commitmate.re_cord.domain.mypage.service;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j

public class MyPageCommentService {
    private final CommentRepository commentRepository;

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
