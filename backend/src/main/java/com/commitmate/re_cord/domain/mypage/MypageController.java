package com.commitmate.re_cord.domain.mypage;

import com.commitmate.re_cord.domain.post.comment.comment.repository.CommentRepository;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentDTO;
import com.commitmate.re_cord.domain.post.post.dto.PostDTO;
import com.commitmate.re_cord.domain.post.post.repository.PostRepository;
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
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentService commentService;




    // user의 게시글만 모아보기
    @GetMapping("/posts/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    //user의 댓글만 모아보기
    @GetMapping("/comments/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable("userId") Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }



    // 게시글의 조회수 총합
    @GetMapping("/views/{userId}")
    public long getTotalPostsViews(@PathVariable("userId") Long userId) {
        return postRepository.totalPostViews(userId);
    }

    //게시글의 좋아요 총합
    @GetMapping("/posts/{userId}/totalLikes")

    public long getTotalPostsLikes(@PathVariable("userId") Long userId) {
        return postRepository.totalPostLikes(userId);
    }

    //댓글의 좋아요 총합
    @GetMapping("/comments/{userId}/totalLikes")

    public long getTotalCommentsLikes(@PathVariable("userId") Long userId) {
        return commentRepository.totalCommentLikes(userId);
    }


    //게시글을 조회수 순으로 정렬
    @GetMapping("/posts/{userId}/orderbyViews")
    public ResponseEntity<List<PostDTO>> getPostsOrderByViews(@PathVariable("userId") Long userId){
        List<PostDTO> posts = postRepository.orderPostsByViews(userId);
        return ResponseEntity.ok(posts);
    }


    //게시글을 좋아요 순으로 정렬
    @GetMapping("/posts/{userId}/orderbyLikes")
    public ResponseEntity<List<PostDTO>> getPostsOrderByLikes(@PathVariable("userId") Long userId){
        List<PostDTO> posts = postRepository.orderPostsByLikes(userId);
        return ResponseEntity.ok(posts);
    }


    // 댓글을 좋아요 순으로 정렬
    @GetMapping("/comments/{userId}/orderbyLikes")
    public ResponseEntity<List<CommentDTO>> getCommentsOrderByLikes(@PathVariable("userId") Long userId){
        List<CommentDTO> comments = commentRepository.orderCommentsByLikes(userId);
        return ResponseEntity.ok(comments);
    }

}




