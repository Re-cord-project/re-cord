package com.commitmate.re_cord.domain.post.post.repository;

import com.commitmate.re_cord.domain.post.post.entity.Image;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    // 게시글에 관련된 이미지를 삭제할 수 있는 메서드
    void deleteByPost(Post post);

}
