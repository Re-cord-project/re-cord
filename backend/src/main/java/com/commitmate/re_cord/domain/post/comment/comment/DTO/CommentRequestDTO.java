package com.commitmate.re_cord.domain.post.comment.comment.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {
    @NotBlank(message = "빈 댓글은 등록할 수 없습니다.")
    @Size(max=200, message = "댓글은 최대 200자까지 등록 가능합니다.")
    private String content;

}
