package com.commitmate.re_cord.domain.user.block.service;

import com.commitmate.re_cord.domain.user.block.entity.Block;
import com.commitmate.re_cord.domain.user.block.repository.BlockRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserService userService;

    /**
     * 사용자 차단
     * @param blockerId 로그인한 사용자 ID (A)
     * @param blockedId 차단 대상 사용자 ID (B)
     */
    public void blockUser(Long blockerId, Long blockedId) {
        User blocker = userService.getUserById(blockerId);
        User blocked = userService.getUserById(blockedId);

        if (blockRepository.existsByBlockerIdAndBlockedId(blocker, blocked)) {
            throw new IllegalStateException("이미 차단한 사용자입니다.");
        }

        Block block = Block.builder()
                .blockerId(blocker)
                .blockedId(blocked)
                .build();

        blockRepository.save(block);
    }

    /**
     * A가 B를 차단했는가?
     * (A → B 차단 여부 확인)
     */
    @Transactional
    public boolean hasBlocked(User blocker, User blocked) {
        return blockRepository.existsByBlockerIdAndBlockedId(blocker, blocked);
    }
}
