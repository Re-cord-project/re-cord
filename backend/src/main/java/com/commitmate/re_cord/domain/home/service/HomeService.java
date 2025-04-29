package com.commitmate.re_cord.domain.home.service;

import com.commitmate.re_cord.domain.home.dto.HomeDto;
import com.commitmate.re_cord.domain.home.dto.HomeResponseDto;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.entity.PostStatus;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeService {

    private final PostRepository postRepository;

    public List<HomeDto> getRecentPublishedPostsWithImages() {
        Pageable pageable = PageRequest.of(0, 4); // 최근 게시글 4개만 가져오기
        Page<Post> posts = postRepository.findRecentPostsWithImagesByStatus(PostStatus.PUBLISHED, pageable);
        return posts.stream()
                .map(HomeDto::from)
                .collect(Collectors.toList());
    }



    public List<HomeDto> getWeeklyPopularPublishedPosts() {
        Pageable pageable = PageRequest.of(0, 4);

        LocalDateTime thisMonday = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        Page<Post> posts = postRepository.findWeeklyPopularPostsByStatus(thisMonday, PostStatus.PUBLISHED, pageable);

        return posts.stream()
                .map(post -> {
                    HomeDto homeDto = HomeDto.from(post);
                    if (homeDto.getThumbnailUrl() == null) {
                        homeDto.updateThumbnailUrl("https://re-cord.s3.ap-northeast-2.amazonaws.com/user/profile/default-thumbnail.png");
                    }
                    return homeDto;
                })
                .collect(Collectors.toList());
    }


    public String findTopBootcampName() {
        Pageable pageable = PageRequest.of(0, 1);
        Page<String> result = postRepository.findHottestBootcamp(pageable);
        return result.isEmpty() ? null : result.getContent().get(0);
    }

    public List<HomeDto> getHotBootcampPosts() {
        Pageable pageable = PageRequest.of(0, 4);

        String hotBootcampName = findTopBootcampName(); // ✅ 여기 수정
        if (hotBootcampName == null) {
            return List.of(); // 아무것도 없으면 빈 리스트 반환
        }

        Page<Post> posts = postRepository.findTop4ByBootcamp(hotBootcampName, pageable);
        return posts.stream()
                .map(HomeDto::from)
                .collect(Collectors.toList());
    }

    public HomeResponseDto getHomePageData() {
        List<HomeDto> recentPosts = getRecentPublishedPostsWithImages();
        List<HomeDto> weeklyPopularPosts = getWeeklyPopularPublishedPosts();
        List<HomeDto> hotBootcampPosts = getHotBootcampPosts();

        return new HomeResponseDto(recentPosts, weeklyPopularPosts, hotBootcampPosts);
    }



}
