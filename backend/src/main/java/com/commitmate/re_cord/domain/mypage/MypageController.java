package com.commitmate.re_cord.domain.mypage;

import com.commitmate.re_cord.domain.post.comment.comment.Service.CommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    private final PostService postService;
    private final CommentService commentService;
    private final UserRepository userRepository;


    @GetMapping("/posts/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/comments/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable("userId") Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }
}




