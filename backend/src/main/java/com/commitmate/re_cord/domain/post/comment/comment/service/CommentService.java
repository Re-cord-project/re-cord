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
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponseDTO registerComment(CommentRequestDTO commentRequestDTO, Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        Comment parent = null;
        if (commentRequestDTO.getParentId() != null) {
            parent = commentRepository.findById(commentRequestDTO.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("원 댓글이 존재하지 않습니다."));
        }

        Comment comment = new Comment(0, commentRequestDTO.getContent(), UpdateStatus.NOT_EDITED, user, post, parent);
        Comment savedComment = commentRepository.save(comment);


        return new CommentResponseDTO(savedComment.getId(),
                savedComment.getContent(),
                user.getUsername(),
                savedComment.getCreatedAt().toString(),
                savedComment.getUpdateStatus().name(),
                user.getProfileImageUrl(),
                savedComment.getLikes(),
                savedComment.getParent() != null ? savedComment.getParent().getId() : null,
                new ArrayList<>());
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }
        comment.setDeleted(true);
        commentRepository.save(comment); //soft delete

    }

    @Transactional
    public CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO, Long postId, Long userId, Long commentId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 작성자만 수정할 수 있습니다.");
        }

        comment.setContent(commentRequestDTO.getContent());
        comment.setUpdateStatus(UpdateStatus.EDITED);

        Comment updatedComment = commentRepository.save(comment);
        return new CommentResponseDTO(updatedComment.getId(),
                updatedComment.getContent(),
                updatedComment.getUser().getUsername(),
                updatedComment.getCreatedAt().toString(),
                updatedComment.getUpdateStatus().name(),
                user.getProfileImageUrl(),
                updatedComment.getLikes(),
                updatedComment.getParent() != null ? updatedComment.getParent().getId() : null,
                new ArrayList<>());
    }

    @Transactional(readOnly = true)
    public Page<CommentResponseDTO> getCommentByPostId(Long postId, int page, int size) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> parentComments = commentRepository.findByPostIdAndParentIsNull(postId, pageable);

        //대댓글은 바로 지워지도록
        List<Comment> allReplies = commentRepository.findByPostIdAndParentIsNotNull(postId);
        Map<Long, List<CommentResponseDTO>> repliesGrouped = allReplies.stream()
                .filter(reply -> !reply.isDeleted())
                .map(CommentResponseDTO::new)
                .sorted(Comparator.comparing(CommentResponseDTO::getCreatedAt))
                .collect(Collectors.groupingBy(CommentResponseDTO::getParentId));

        //대댓글이 없는 댓글은 바로 지워지도록
        List<CommentResponseDTO> commentDTOs = parentComments.getContent().stream()
                .filter(parent -> !(parent.isDeleted() && !repliesGrouped.containsKey(parent.getId())))
                .map(parent -> {
                    CommentResponseDTO dto = new CommentResponseDTO(parent);
                    dto.setReplies(repliesGrouped.getOrDefault(parent.getId(), new ArrayList<>()));
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(commentDTOs, pageable, parentComments.getTotalElements());
    }

}

