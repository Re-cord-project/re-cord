package com.commitmate.re_cord.domain.post.comment.comment.service;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponseDTO registerComment(CommentRequestDTO commentRequestDTO, Long postId, Long userId){
        Post post = postRepository.findById(postId)
                .orElseThrow(()->new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        Comment comment = new Comment(0,commentRequestDTO.getContent(), UpdateStatus.NOT_EDITED,user,post);
        Comment savedComment = commentRepository.save(comment);


        return new CommentResponseDTO(savedComment.getId(), savedComment.getContent(),user.getUsername(),savedComment.getCreatedAt().toString());
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId){

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()-> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        if(!comment.getUser().getId().equals(userId)){
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);

    }

    @Transactional
    public CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO, Long postId, Long userId, Long commentId){

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()-> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        if(!comment.getUser().getId().equals(userId)){
            throw new IllegalArgumentException("댓글 작성자만 수정할 수 있습니다.");
        }

        comment.setContent(commentRequestDTO.getContent());
        comment.setUpdateStatus(UpdateStatus.EDITED);

        Comment updatedComment = commentRepository.save(comment);
        return new CommentResponseDTO(updatedComment.getId(),updatedComment.getContent(),updatedComment.getUser().getUsername(),updatedComment.getCreatedAt().toString());
    }

    public List<CommentDTO> getCommentsByUser(Long userId) {
        return commentRepository.findMyComment(userId).stream()
                .map(CommentDTO::getEntity)
                .collect(Collectors.toList());

    }


}

