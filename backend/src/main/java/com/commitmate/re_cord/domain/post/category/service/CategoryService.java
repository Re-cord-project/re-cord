package com.commitmate.re_cord.domain.post.category.service;


import com.commitmate.re_cord.domain.post.category.dto.CategoryRequest;
import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.post.category.repository.CategoryRepository;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.user.user.dto.UserResponseDto;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository; // UserRepository를 주입받아서 사용

    private static final Long DEFAULT_CATEGORY_ID = 1L;

    // 카테고리 생성 (로그인한 사용자만 가능)
    public Category createCategory(long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Category category = new Category();
        category.setName(name);
        category.setUser(user);
        category.setPostCount(0); // 초기 postCount는 0

        return categoryRepository.save(category);
    }

    // 특정 사용자의 카테고리 목록 조회
    public List<Category> getCategoriesByUserId(long userId) {
        return categoryRepository.findByUserId(userId);
    }

    // 특정 카테고리 조회 (로그인한 사용자만 조회 가능)
    public Category getCategoryByIdAndUserId(Long categoryId, long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        if (category.getUser().getId() != userId) {
            throw new IllegalArgumentException("이 카테고리는 다른 사용자의 카테고리입니다.");
        }

        return category;
    }

    // 카테고리 삭제 (로그인한 사용자만 가능)
    @Transactional
    public boolean deleteCategory(Long categoryId, long userId) {
        // 카테고리 조회
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        // 사용자가 해당 카테고리의 소유자인지 확인
        if (category.getUser().getId() != userId) {
            return false; // 권한이 없으면 삭제 불가
        }

        // 해당 카테고리에 속한 게시글들의 카테고리 변경 (기본 카테고리로)
        for (Post post : category.getPosts()) {
            post.setCategory(categoryRepository.findById(DEFAULT_CATEGORY_ID)
                    .orElseThrow(() -> new IllegalArgumentException("기본 카테고리를 찾을 수 없습니다.")));
        }

        // 게시글 카테고리 변경 후 카테고리 삭제
        categoryRepository.delete(category);
        return true; // 삭제 완료
    }

    public List<UserResponseDto> findUsersByCategoryId(Long categoryId) {
        List<User> users = userRepository.findUsersByCategoryId(categoryId);
        List<UserResponseDto> result = new ArrayList<>();

        for (User user : users) {
            result.add(UserResponseDto.from(user));
        }

        return result;
    }

}