package com.commitmate.re_cord.domain.user.block.service;

import com.commitmate.re_cord.domain.post.comment.comment.entity.Comment;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.user.block.dto.BlockUserResponseDto;
import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.block.repository.BlockRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.exception.BlockNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserService userService;
    private final CommentRepository commentRepository;

    // 사용자 차단
    public void blockUser(Long blockerId, Long blockedId) {
        User blocker = userService.getUserById(blockerId);
        User blocked = userService.getUserById(blockedId);

        // 이미 차단한 경우 예외 발생
        if (blockRepository.existsByBlockerIdAndBlockedId(blocker, blocked)) {
            throw new IllegalStateException("이미 차단한 사용자입니다.");
        }

        // 차단 관계 저장
        Block block = Block.builder()
                .blockerId(blocker)
                .blockedId(blocked)
                .build();

        blockRepository.save(block);
    }

    // A가 B를 차단했는지 확인
    @Transactional
    public boolean hasBlocked(User blocker, User blocked) {
        return blockRepository.existsByBlockerIdAndBlockedId(blocker, blocked);
    }

    // 사용자 차단 해제
    @Transactional
    public void unblockUser(Long blockerId, Long blockedId) {
        User blocker = userService.getUserById(blockerId);
        User blocked = userService.getUserById(blockedId);

        // 차단 관계가 없는 경우 예외 발생
        boolean isBlocked = blockRepository.existsByBlockerIdAndBlockedId(blocker, blocked);
        if (!isBlocked) {
            throw new BlockNotFoundException(blockerId, blockedId);
        }

        // 차단 관계 삭제
        blockRepository.deleteByBlockerIdAndBlockedId(blocker, blocked);
    }

    // 차단한 유저 목록 조회
    @Transactional(readOnly = true)
    public List<BlockUserResponseDto> getBlockedList(Long userId) {
        // 차단자 정보 조회
        User blocker = userService.getUserById(userId);

        // Block 엔티티 조회 후 User → DTO 매핑
        return blockRepository.findByBlockerId(blocker)
                .stream()
                .map(block -> {
                            User blockedUser = block.getBlockedId();

                    return BlockUserResponseDto.builder()
                            .userId(blockedUser.getId())
                            .username(blockedUser.getUsername())
                            .profileImageUrl(blockedUser.getProfileImageUrl())
                            .blogName(blockedUser.getBlogName())
                            .build();
                })
                .toList();
    }

    // 차단 여부 확인
    public void checkIfBlocked(Long blockerId, Long blockedId, String message) {
        User blocker = userService.getUserById(blockerId);    // 차단한 사람
        User blocked = userService.getUserById(blockedId);    // 차단된 사람

        // 차단된 사용자가 게시물 접근, 댓글 작성 하려고 할 때 예외를 던져서 차단
        if (hasBlocked(blocker, blocked)) {
            throw new AccessDeniedException(message);  // message를 전달받아 처리
        }
    }

    //대댓글 작성시 차단 여부 확인
    @Transactional(readOnly = true)
    public void checkIfBlockedByComment(Long parentCommentId, Long blockedId, String message) {
        // 1) 부모 댓글 엔티티 조회
        Comment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        // 2) 부모 댓글 작성자 ID를 blockerId로 사용
        Long blockerId = parent.getUser().getId();

        // 3) 기존 checkIfBlocked 로직 재사용
        checkIfBlocked(blockerId, blockedId, message);
    }
}
