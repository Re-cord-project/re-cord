package com.commitmate.re_cord.domain.post.post.service;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.post.category.repository.CategoryRepository;
import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.entity.PostLike;
import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import com.commitmate.re_cord.domain.post.post.repository.PostLikeRepository;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final PostLikeRepository postLikeRepository;

    //게시글 생성
    @Transactional
    public void createPost(PostRequestDto postRequestDto, User user) {

        Category category = categoryRepository.findById(postRequestDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

        PostStatus status = postRequestDto.getStatus();
        if (status == null) {
            throw new IllegalArgumentException("게시글 상태는 필수입니다.");
        }

        // 임시 저장 버튼을 누르면 제목과 내용이 없고 DRAFT 상태로 저장됨
        // 저장 버튼을 누르면 상태가 PUBLISHED 되고 제목과 내용을 필수로 입력하게 함
        if (status == PostStatus.PUBLISHED) {
            if (postRequestDto.getTitle() == null || postRequestDto.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("제목은 필수입니다.");
            }
            if (postRequestDto.getContent() == null || postRequestDto.getContent().trim().isEmpty()) {
                throw new IllegalArgumentException("내용은 필수입니다.");
            }
        }

        // Post 엔티티 생성
        Post post = Post.builder()
                .title(postRequestDto.getTitle())
                .content(postRequestDto.getContent())
                .status(status)
                .user(user)
                .category(category)
                .likes(0)
                .views(0)
                .updateStatus(getUpdateStatusByPostStatus(status))  // 여기서 UpdateStatus 설정
                .build();

        postRepository.save(post);
    }

    // PostStatus에 따라 UpdateStatus를 설정하는 메서드
    private UpdateStatus getUpdateStatusByPostStatus(PostStatus status) {
        if (status == PostStatus.PUBLISHED) {
            return UpdateStatus.EDITED;  // PUBLISHED 상태일 때 UpdateStatus는 EDITED
        }  else if (status == PostStatus.DRAFT) {
            return UpdateStatus.TEMP_SAVED;  // TEMP_SAVED 상태일 때 UpdateStatus는 TEMP_SAVED
        } else {
            return UpdateStatus.NOT_EDITED;  // 기본값
        }
    }

    //게시글 작성중 임시저장된 글을 불러올 때
    @Transactional
    public Optional<Post> getLatestDraftByUser(User user) {
        return postRepository.findTopByUserAndStatusOrderByUpdatedAtDesc(user, PostStatus.DRAFT);
    }

    // 게시글 전체 보기 (삭제된 글 제외)
    @Transactional
    public Page<PostResponseDto> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 삭제된 포스트를 제외하고 조회
        Page<Post> postPage = postRepository.findAllByUpdateStatus(UpdateStatus.EDITED, pageable);


        return postPage.map(PostResponseDto::new);
    }

    // 게시글 카테고리 별로 보기
    @Transactional
    public Page<PostResponseDto> getPostsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 카테고리와 삭제되지 않은 포스트들을 조회
        Page<Post> postPage = postRepository.findAllByCategoryIdAndUpdateStatus(categoryId, UpdateStatus.EDITED, pageable);

        return postPage.map(PostResponseDto::new);
    }

    // 게시글 검색
    // 게시글 검색
    @Transactional(readOnly = true)
    public Page<PostResponseDto> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // EDITED 상태이고, 제목/내용/작성자 기준 검색
        Page<Post> postPage = postRepository.searchVisiblePosts(keyword, pageable);

        return postPage.map(PostResponseDto::new);
    }


    // 게시글 상세 보기
    @Transactional
    public PostResponseDto getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return new PostResponseDto(post);
    }

    // 게시글 수정
    @Transactional
    public void updatePost(Long postId, PostRequestDto dto, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new SecurityException("작성자 본인만 수정할 수 있습니다.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setStatus(dto.getStatus());
        post.setCategory(category);
        post.setUpdateStatus(UpdateStatus.UPDATED);

        postRepository.save(post);
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new SecurityException("작성자 본인만 삭제할 수 있습니다.");
        }

        post.setUpdateStatus(UpdateStatus.DELETED);
        postRepository.save(post);
    }

    @Transactional
    public void toggleLike(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Optional<PostLike> existingLike = postLikeRepository.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            // 이미 추천한 경우 → 추천 취소
            postLikeRepository.delete(existingLike.get());
            post.decreaseLikeCount(); // 추천 수 -1
        } else {
            // 추천하지 않은 경우 → 추천 추가
            PostLike like = new PostLike(post, user);
            postLikeRepository.save(like);
            post.increaseLikeCount(); // 추천 수 +1
        }

        postRepository.save(post);
    }

}