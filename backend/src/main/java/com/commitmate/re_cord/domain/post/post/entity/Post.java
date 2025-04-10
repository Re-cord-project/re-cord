package com.commitmate.re_cord.domain.post.post.entity;

import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Post extends BaseEntity {

    private String title;
    private String content;

}
