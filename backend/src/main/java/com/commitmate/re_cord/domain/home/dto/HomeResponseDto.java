package com.commitmate.re_cord.domain.home.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class HomeResponseDto {
    private List<HomeDto> recentPosts;
    private List<HomeDto> weeklyPopularPosts;
    private List<HomeDto> hotBootcampPosts;
}
