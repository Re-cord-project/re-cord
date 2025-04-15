package com.commitmate.re_cord.domain.post.post.repository;

import com.commitmate.re_cord.domain.post.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId")
    List<Post> findMyPost(@Param("userId") Long userId);

}
