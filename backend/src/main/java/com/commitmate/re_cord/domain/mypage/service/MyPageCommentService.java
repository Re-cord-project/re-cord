package com.commitmate.re_cord.domain.mypage.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MyPageCommentService {
    private final CommentRepository commentRepository;


    public Page<CommentDTO> getCommentsByUserIdByDesc(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return commentRepository.findMyComment(userId, pageable).map(CommentDTO::getEntity);
    }

    // 댓글 좋아요 총합
    public Long getTotalCommentLikes(Long userId){
        return commentRepository.totalCommentLikes(userId);
    }

    // 댓글 좋아요 순 정렬
    public Page<CommentDTO> getCommentsOrderedByLikes(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "likes"));
        return commentRepository.orderCommentsByLikes(userId, pageable).map(CommentDTO::getEntity);
    }
}
