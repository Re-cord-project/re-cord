package com.commitmate.re_cord.global.exception;

public class BlockNotFoundException extends RuntimeException {

    public BlockNotFoundException(Long blockerId, Long blockedId) {
        super("차단한 내역이 없는 사용자입니다.");
    }
}