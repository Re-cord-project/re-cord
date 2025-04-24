package com.commitmate.re_cord.domain.mypage.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MyPagePostService {
    private final PostRepository postRepository;

    public Page<PostDTO> getPostsByUserIdByDesc(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.findMyPost(userId, pageable).map(PostDTO::getEntity);
    }

    //게시글 조회수 총합
    public Long getTotalPostViews(Long userId) {
        return postRepository.totalPostViews(userId);
    }

    //게시글 좋아요 총합
    public Long getTotalPostLikes(Long userId) {
        return postRepository.totalPostLikes(userId);
    }

    //게시글 조회수 순 정렬
    public Page<PostDTO> getPostsOrderedByViews(Long userId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "views"));
        return postRepository.orderPostsByViews(userId, pageable).map(PostDTO::getEntity);
    }


    //게시글 좋아요 순 정렬
    public Page<PostDTO> getPostsOrderedByLikes(Long userId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "likes"));
        return postRepository.orderPostsByLikes(userId, pageable).map(PostDTO::getEntity);
    }

    //월별 조회수 통계
    public List<MonthlyViewDTO> getMonthlyViewStats(Long userId){
        List<Object[]> result = postRepository.getMonthlyViews(userId);
        return result.stream()
                .map(row -> new MonthlyViewDTO(
                        (String) row[0],
                        ((Number)row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }
}


