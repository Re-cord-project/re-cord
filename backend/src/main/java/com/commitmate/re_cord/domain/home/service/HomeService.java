package com.commitmate.re_cord.domain.home.service;

import com.commitmate.re_cord.domain.home.dto.HomeDto;
import com.commitmate.re_cord.domain.home.dto.HomeResponseDto;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.domain.user.user.entity.User;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;

    public List<HomeDto> getRecentPostsWithImages() {
        Pageable pageable = PageRequest.of(0, 4); // 4개만 가져오기
        Page<Post> posts = postRepository.findRecentPostsWithImages(pageable);
        return posts.stream()
                .map(HomeDto::from)
                .collect(Collectors.toList());
    }


    public List<HomeDto> getWeeklyPopularPosts() {
        Pageable pageable = PageRequest.of(0, 4);


        LocalDateTime thisMonday = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                .atStartOfDay();

        Page<Post> posts = postRepository.findWeeklyPopularPosts(thisMonday, pageable);
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

    public List<HomeDto> getPopularPostsByBootcamp(String bootcamp) {
        Pageable pageable = PageRequest.of(0, 8);
        Page<Post> posts = postRepository.findPopularPostsByBootcamp(bootcamp, pageable);

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



}
