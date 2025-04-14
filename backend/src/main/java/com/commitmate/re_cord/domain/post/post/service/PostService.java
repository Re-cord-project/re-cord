package com.commitmate.re_cord.domain.post.post.service;

import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.entity.Post;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<PostDTO> getPostsByUserId(Long userId) {
        return postRepository.findMyPost(userId).stream()
                .map(PostDTO::getEntity)
                .collect(Collectors.toList());
    }

}

