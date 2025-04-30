package com.commitmate.re_cord.domain.user.user.dto;

import com.commitmate.re_cord.domain.user.user.entity.User;
import lombok.Getter;
import lombok.NonNull;

import java.time.LocalDateTime;

@Getter
public class UserDto {
    @NonNull
    private final long id;

//    @NonNull
//    private final LocalDateTime createDate;
//
//    @NonNull
//    private final LocalDateTime modifyDate;

    @NonNull
    private final String email;

    @NonNull
    private final String username;

    private final String bootcamp;

    private final String generation;

    public UserDto(User user) {
        this.id = user.getId();
//        this.createDate = user.getCreatedDate();
//        this.modifyDate = user.getModifiedDate();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.bootcamp = user.getBootcamp();
        this.generation = user.getGeneration();
    }
}
