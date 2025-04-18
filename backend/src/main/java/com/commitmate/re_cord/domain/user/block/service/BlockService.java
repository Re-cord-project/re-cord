package com.commitmate.re_cord.domain.user.block.service;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.block.repository.BlockRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import com.commitmate.re_cord.global.exception.BlockNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserService userService;

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
    @Transactional
    public List<Block> getBlockedUsers(Long blockerId) {
        User blocker = userService.getUserById(blockerId);
        return blockRepository.findByBlockerId(blocker); // blocker가 차단한 유저 목록 반환
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

}
