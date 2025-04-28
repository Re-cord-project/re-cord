package com.commitmate.re_cord.domain.post.post.service;

import com.commitmate.re_cord.domain.post.category.entity.Category;
import com.commitmate.re_cord.domain.post.category.repository.CategoryRepository;
import com.commitmate.re_cord.domain.post.post.dto.PostRequestDto;
import com.commitmate.re_cord.domain.post.post.dto.PostResponseDto;
import com.commitmate.re_cord.domain.post.post.dto.PostUpdateRequestDto;
import com.commitmate.re_cord.domain.post.post.entity.Image;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.entity.PostLike;
import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import com.commitmate.re_cord.domain.post.post.repository.ImageRepository;
import com.commitmate.re_cord.domain.post.post.repository.PostLikeRepository;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import com.commitmate.re_cord.global.config.S3Service;
import com.commitmate.re_cord.global.exception.exceptions.ResourceNotFoundException;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final ImageRepository imageRepository;

    //게시글 생성
    @Transactional
    public void createPost(PostRequestDto postRequestDto, List<MultipartFile> images, long userId) {
        Post savedPost = null;

        try {
            // 카테고리 검증
            Category category = categoryRepository.findById(postRequestDto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

            // 게시글 상태 검증
            PostStatus status = postRequestDto.getStatus();
            if (status == null) {
                throw new IllegalArgumentException("게시글 상태는 필수입니다.");
            }

            if (status == PostStatus.PUBLISHED) {
                // 제목 및 내용 필수 검증
                if (postRequestDto.getTitle() == null || postRequestDto.getTitle().trim().isEmpty()) {
                    throw new IllegalArgumentException("제목은 필수입니다.");
                }
                if (postRequestDto.getContent() == null || postRequestDto.getContent().trim().isEmpty()) {
                    throw new IllegalArgumentException("내용은 필수입니다.");
                }
            }

            // 유저 조회
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            // 게시글 상태가 DRAFT일 경우 기존 DRAFT 삭제
            if (status == PostStatus.DRAFT) {
                postRepository.deleteByUserAndStatus(user, PostStatus.DRAFT);
            }

            // 게시글 생성
            Post post = Post.builder()
                    .title(postRequestDto.getTitle())
                    .content(postRequestDto.getContent())
                    .status(status)
                    .user(user)
                    .category(category)
                    .likes(0)
                    .views(0)
                    .updateStatus(getUpdateStatusByPostStatus(status))
                    .build();
            System.out.println("넘어온 이미지 수: " + (images != null ? images.size() : 0));

            // 게시글 저장
            savedPost = postRepository.save(post);
            System.out.println("게시글 저장 완료. ID: " + savedPost.getId());

            // 이미지 처리
            if (images != null && !images.isEmpty()) {
                // 이미지가 있을 경우 하나씩 처리
                for (MultipartFile image : images) {
                    // 이미지 업로드 및 DB 저장
                    uploadAndSaveImage(image, savedPost, userId);
                }
            }

        } catch (Exception e) {
            // 예외 발생 시 로그 출력 후 롤백
            System.err.println("게시글 저장 트랜잭션 실패: " + e);
            e.printStackTrace();
            throw e;  // 트랜잭션 롤백을 위해 다시 throw
        }
    }

    private void uploadAndSaveImage(MultipartFile image, Post savedPost, long userId) {
        try {
            // 이미지 업로드 (S3 서비스에서 실패 시 예외 발생)
            String fileKey = s3Service.uploadImage(image, userId);
            if (fileKey == null || fileKey.isEmpty()) {
                throw new RuntimeException("S3 업로드 실패: fileKey가 null이거나 비어 있습니다.");
            }

            String imageUrl = "https://s3-bucket-url.com/" + fileKey;

            // 이미지 정보 저장 전 검증
            if (savedPost == null) {
                throw new RuntimeException("게시글이 null입니다. 게시글이 저장되지 않았습니다.");
            }

            // Image 객체 생성 및 DB 저장
            Image postImage = Image.builder()
                    .imageUrl(imageUrl)
                    .post(savedPost)  // 이미 저장된 post 사용
                    .fileKey(fileKey)
                    .build();

            // 즉시 저장 및 flush 확인
            Image savedImage = imageRepository.save(postImage);
            if (savedImage == null) {
                throw new RuntimeException("이미지 저장 실패: 저장된 이미지 객체가 null입니다.");
            }

            System.out.println("이미지 저장 성공: " + savedImage.getId());
        } catch (Exception e) {
            // 이미지 업로드 또는 저장 실패 시 로그
            System.err.println("이미지 업로드 또는 저장 실패. 파일명: " + image.getOriginalFilename());
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();

            // 트랜잭션 롤백을 위해 RuntimeException 던짐
            throw new RuntimeException("이미지 저장 실패로 인해 게시글 저장을 롤백합니다.");
        }
    }


    @Transactional
    public void updatePost(Long postId, PostUpdateRequestDto postUpdateRequestDto, User user) {
        // 1. 수정할 게시글 존재 여부 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("수정할 게시글을 찾을 수 없습니다. ID: " + postId));

        // 2. 수정 권한 확인
        if (!post.getUser().getId().equals(user.getId())) {
            throw new SecurityException("작성자 본인만 수정할 수 있습니다.");
        }

        // 3. 기존 카테고리 가져오기
        Category oldCategory = post.getCategory();

        // 4. 새 카테고리 조회
        Category newCategory = categoryRepository.findById(postUpdateRequestDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다. ID: " + postUpdateRequestDto.getCategoryId()));

        // 5. 게시글 상태 (기존 or 새 값)
        PostStatus newStatus = postUpdateRequestDto.getStatus() != null ? postUpdateRequestDto.getStatus() : post.getStatus();

        // 6. 카테고리가 바뀌었고, 게시글 상태가 PUBLISHED인 경우 postCount 업데이트
        if (!oldCategory.getId().equals(newCategory.getId()) && post.getStatus() == PostStatus.PUBLISHED) {
            oldCategory.setPostCount(oldCategory.getPostCount() - 1);
            newCategory.setPostCount(newCategory.getPostCount() + 1);
        }

        // 7. 게시글 내용 업데이트
        post.setTitle(postUpdateRequestDto.getTitle());
        post.setContent(postUpdateRequestDto.getContent());
        post.setStatus(newStatus);
        post.setCategory(newCategory);
        post.setUpdateStatus(UpdateStatus.UPDATED);

        // 8. 기존 이미지 삭제
        List<String> imageUrlsToDelete = postUpdateRequestDto.getImageUrlsToDelete();
        if (imageUrlsToDelete != null && !imageUrlsToDelete.isEmpty()) {
            for (String imageUrl : imageUrlsToDelete) {
                s3Service.delete(imageUrl);  // S3에서 삭제
            }
            imageRepository.deleteAll(post.getImages());  // DB에서 삭제
        }

        // 9. 새 이미지 업로드
        List<MultipartFile> newImages = postUpdateRequestDto.getNewImages();
        if (newImages != null && !newImages.isEmpty()) {
            List<Image> uploadedImages = new ArrayList<>();
            for (MultipartFile imageFile : newImages) {
                try {
                    String imageUrl = s3Service.uploadImage(imageFile, user.getId());
                    Image newImage = new Image();
                    newImage.setImageUrl(imageUrl);
                    newImage.setPost(post);
                    uploadedImages.add(newImage);
                } catch (IOException e) {
                    throw new RuntimeException("새 이미지 업로드 실패: " + e.getMessage());
                }
            }
            post.setImages(uploadedImages);
        }

        // 10. 기존 이미지 URL 수정 (변경된 이미지 URL을 업데이트)
        List<String> updatedImageUrls = postUpdateRequestDto.getUpdatedImageUrls(); // 수정된 이미지 URL 리스트
        if (updatedImageUrls != null && !updatedImageUrls.isEmpty()) {
            for (int i = 0; i < updatedImageUrls.size(); i++) {
                Image image = post.getImages().get(i);  // 게시글에 연결된 기존 이미지
                String updatedUrl = updatedImageUrls.get(i);
                image.setImageUrl(updatedUrl);  // 기존 이미지의 URL을 수정된 URL로 업데이트
            }
        }

        // 트랜잭션 종료 시 변경사항 자동 반영
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
        return postRepository.findTopByUserAndStatusOrderByUpdatedAtDescWithImages(user, PostStatus.DRAFT);
    }

    // 게시글 전체 보기 (삭제된 글 제외)
    @Transactional
    public Page<PostResponseDto> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 상태가 PUBLISHED인 게시물을 가져오는 메서드
        Page<Post> postPage = postRepository.findAllByStatus(PostStatus.PUBLISHED, pageable);


        return postPage.map(PostResponseDto::new);
    }

    // 게시글 카테고리 별로 보기
    @Transactional
    public Page<PostResponseDto> getPostsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 특정 카테고리와 PUBLISHED를 만족하는 게시글을 조회
        Page<Post> postPage = postRepository.findAllByCategoryIdAndStatus(categoryId, PostStatus.PUBLISHED, pageable);

        return postPage.map(PostResponseDto::new);
    }

    // 게시글 검색
    @Transactional(readOnly = true)
    public Page<PostResponseDto> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // PUBLISHED 상태이고, 제목/내용/작성자 기준 검색
        Page<Post> postPage = postRepository.searchVisiblePosts(keyword, pageable);

        return postPage.map(PostResponseDto::new);
    }


    // 게시글 상세 보기
    @Transactional
    public PostResponseDto getPostById(Long postId) {
        Post post = postRepository.findByIdWithImages(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return new PostResponseDto(post);
    }

    @Transactional(readOnly = true)
    public int getPostLikes(Long postId) {
        return postRepository.findLikesById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    @Transactional(readOnly = true)
    public int getPostViews(Long postId) {
        return postRepository.findViewsById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new SecurityException("작성자 본인만 삭제할 수 있습니다.");
        }

        // 게시글 상태를 DELETED로 변경하고 postCount를 업데이트하는 메서드 호출
        post.updateStatus(PostStatus.DELETED);
        postRepository.save(post); // 변경된 상태를 저장
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

    public PostResponseDto getLatestPostByUserId(Long userId) {
        // 쿼리에서 최신 게시글을 가져오는 부분
        Post post = postRepository.findTopByUserIdWithImages(userId)
                .orElseThrow(() -> new ResourceNotFoundException("게시글이 없습니다."));

        return new PostResponseDto(post);
    }



    public List<PostResponseDto> getOtherPostsBySameUser(Long userId, Long excludePostId) {
        // excludePostId가 null이어도 조회할 수 있는 메소드 사용
        List<Post> otherPosts = postRepository.findByUserIdAndIdNotFetchImages(userId, excludePostId);

        return otherPosts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    // 작성자의 모든 게시글 조회 (userId 기준)
    public List<PostResponseDto> getAllPostsByUser(Long userId) {
        // 유저 존재 여부 확인 (옵션)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. id=" + userId));

        List<Post> posts = postRepository.findAllByUserIdWithImages(userId);
        return posts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    public boolean isPostLikedByUser(Long postId, Long userId) {
        return postLikeRepository.existsByPostIdAndUserId(postId, userId);
    }

    public Long getTotalPostCount(Long userId) {
        return postRepository.totalPostCount(userId);
    }

    @Transactional
    public void uploadPostImages(Long postId, List<MultipartFile> files, Long userId) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        for (MultipartFile file : files) {
            String fileKey = s3Service.uploadImage(file, userId);
            String imageUrl = s3Service.getFileUrl(fileKey);

            Image image = Image.builder()
                    .fileKey(fileKey)
                    .imageUrl(imageUrl)
                    .post(post)
                    .build();

            post.getImages().add(image);
        }

        postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        for (Image image : post.getImages()) {
            s3Service.delete(image.getFileKey());
        }

        postRepository.delete(post);
    }

}
