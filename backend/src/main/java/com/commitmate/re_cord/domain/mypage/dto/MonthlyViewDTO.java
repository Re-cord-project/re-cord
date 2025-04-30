package com.commitmate.re_cord.domain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor

public class MonthlyViewDTO {
    private String month;
    private Long totalViews;

    public MonthlyViewDTO(String month, Long totalViews){
        this.month = month;
        this.totalViews =totalViews;
    }
}
