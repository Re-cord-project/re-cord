package com.commitmate.re_cord.domain.mypage.service;


import com.commitmate.re_cord.domain.mypage.dto.MonthlyViewDTO;
import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MyPageService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;


    //게시글 조회수 총합
    public Long getTotalPostViews(Long userId){
        return postRepository.totalPostViews(userId);
    }

    //게시글 좋아요 총합
    public Long getTotalPostLikes(Long userId){
        return postRepository.totalPostLikes(userId);
    }

    //게시글 조회수 순 정렬
    public List<PostDTO> getPostsOrderedByViews(Long userId){
        return postRepository.orderPostsByViews(userId).stream()
                .map(PostDTO::getEntity)
                .collect(Collectors.toList());
    }

    //게시글 좋아요 순 정렬
    public List<PostDTO> getPostsOrderedByLikes(Long userId){
        return postRepository.orderPostsByLikes(userId).stream()
                .map(PostDTO::getEntity)
                .collect(Collectors.toList());
    }


    // 댓글 좋아요 총합
    public Long getTotalCommentLikes(Long userId){
        return commentRepository.totalCommentLikes(userId);
    }

    // 댓글 좋아요 순 정렬
    public List<CommentDTO> getCommentsOrderedByLikes(Long userId){
        return commentRepository.orderCommentsByLikes(userId).stream()
                .map(CommentDTO::getEntity)
                .collect(Collectors.toList());
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
