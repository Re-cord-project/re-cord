package com.commitmate.re_cord.scheduler;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import com.commitmate.re_cord.global.jpa.UpdateStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PostCleanupScheduler {

    private final PostRepository postRepository;

    // 매일 새벽 3시에 실행 (cron: 초 분 시 일 월 요일)
    @Scheduled(cron = "0 0 3 * * *")
    public void deleteOldSoftDeletedPosts() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(15);
        List<Post> oldDeletedPosts = postRepository.findAllByUpdateStatusAndUpdatedAtBefore(UpdateStatus.DELETED, threshold);

        postRepository.deleteAll(oldDeletedPosts);
        System.out.println("[Scheduler] 하드 삭제된 게시글 수: " + oldDeletedPosts.size());
    }
}
