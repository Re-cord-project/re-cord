package com.commitmate.re_cord.global.exception;

public class BlockNotFoundException extends RuntimeException {

    public BlockNotFoundException(Long blockerId, Long blockedId) {
        super("해당 차단 내역이 존재하지 않습니다.");
    }
}