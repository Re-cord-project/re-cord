package com.commitmate.re_cord.domain.post.category.entity;

import com.commitmate.re_cord.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Category extends BaseEntity {
    public String name;
    public String description;

}
