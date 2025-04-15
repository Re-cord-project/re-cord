package com.commitmate.re_cord.global.jpa;

public enum UpdateStatus {
    NOT_EDITED(0,false,"미작성"),
    EDITED(1,true,"작성 완료"),
    TEMP_SAVED(2,false,"임시 저장"),
    DELETED(3, false, "삭제"),
    UPDATED(4, true, "수정 완료");
    private final int code;
    private final boolean edited;
    private final String description;

    UpdateStatus(int code, boolean edited, String description){
        this.code=code;
        this.edited=edited;
        this.description=description;
    }

}
