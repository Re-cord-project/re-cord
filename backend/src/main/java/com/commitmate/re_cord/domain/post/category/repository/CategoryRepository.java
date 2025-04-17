package com.commitmate.re_cord.domain.post.category.repository;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
