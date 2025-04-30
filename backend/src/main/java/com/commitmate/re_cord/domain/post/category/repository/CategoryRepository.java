package com.commitmate.re_cord.domain.post.category.repository;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.user.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // 특정 사용자의 카테고리만 조회
    List<Category> findByUserId(long userId);
}