package com.commitmate.re_cord.domain.user.block.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BlockActionRequestDto {
    private Long blockedId; //차단할 유저의 ID
}
