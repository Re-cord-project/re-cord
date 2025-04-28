package com.commitmate.re_cord.domain.post.category.controller;


import com.commitmate.re_cord.domain.post.category.dto.CategoryRequest;
import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.post.category.service.CategoryService;
import com.commitmate.re_cord.global.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 카테고리 생성 (로그인한 사용자만 가능)
    @PostMapping
    public ResponseEntity<String> createCategory(
            @Valid @RequestBody CategoryRequest categoryRequest,
            @AuthenticationPrincipal SecurityUser userDetails) {

        long userId = userDetails.getId();
        Category category = categoryService.createCategory(userId, categoryRequest.getName());

        return ResponseEntity.ok("카테고리 생성 완료: " + category.getName());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Category>> getCategories(@PathVariable long userId) {
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    // 로그인한 사용자만 자신의 카테고리 목록 조회
    @GetMapping
    public ResponseEntity<List<Category>> getCategories(@AuthenticationPrincipal SecurityUser userDetails) {
        long userId = userDetails.getId();
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    // 로그인한 사용자만 자신이 만든 카테고리 삭제
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal SecurityUser userDetails) {

        long userId = userDetails.getId();
        boolean isDeleted = categoryService.deleteCategory(categoryId, userId);

        if (isDeleted) {
            return ResponseEntity.ok("카테고리 삭제 완료");
        } else {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }
    }
}