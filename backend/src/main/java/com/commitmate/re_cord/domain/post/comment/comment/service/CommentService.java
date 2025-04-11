package com.commitmate.re_cord.domain.post.comment.comment.service;


import com.commitmate.re_cord.domain.post.comment.comment.DTO.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.DTO.CommentResponseDTO;
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
}
