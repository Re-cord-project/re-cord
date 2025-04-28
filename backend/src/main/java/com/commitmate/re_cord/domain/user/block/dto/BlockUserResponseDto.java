package com.commitmate.re_cord.domain.user.block.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockUserResponseDto {
    private Long userId;
    private String username;
    private String profileImageUrl;
    private String blogName;

}