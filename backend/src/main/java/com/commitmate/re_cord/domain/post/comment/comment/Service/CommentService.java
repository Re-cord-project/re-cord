package com.commitmate.re_cord.domain.post.comment.comment.Service;

import com.commitmate.re_cord.domain.post.comment.comment.Repository.CommentRepository;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;


    public List<CommentDTO> getCommentsByUser(Long userId) {
        return commentRepository.findMyComment(userId).stream()
                .map(CommentDTO::getEntity)
                .collect(Collectors.toList());
    }
}

