package com.commitmate.re_cord.domain.post.comment.comment.controller;


import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentRequestDTO;
import com.commitmate.re_cord.domain.post.comment.comment.dto.CommentResponseDTO;
import com.commitmate.re_cord.domain.post.comment.comment.service.CommentService;
import com.commitmate.re_cord.domain.post.comment.commentVote.service.CommentVoteService;
import com.commitmate.re_cord.domain.post.post.service.PostService;
import com.commitmate.re_cord.domain.user.block.service.BlockService;
import com.commitmate.re_cord.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("api/posts/{postId}/comments")
@RequiredArgsConstructor
public class ApiV1CommentController {

    private final CommentService commentService;
    private final CommentVoteService commentVoteService;
    private final BlockService blockService;
    private final PostService postService;


    @Operation(
            summary = "댓글 작성"
    )
    @PostMapping
    public ResponseEntity<CommentResponseDTO> registerComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDTO requestDTO,
            @AuthenticationPrincipal SecurityUser userDetails
            ){
        Long userId = userDetails.getId();

        // 게시글 작성자가 나를 차단했는지 검사
        Long postAuthorId = postService.getPostById(postId).getUserId();
        blockService.checkIfBlocked(postAuthorId, userId, "댓글을 작성할 수 없습니다.");

        // 대댓글인 경우, 부모 댓글 작성자가 나를 차단했는지 검사
        Long parentId = requestDTO.getParentId();
        if (parentId != null) {
            blockService.checkIfBlockedByComment(
                    parentId,
                    userId,
                    "대댓글을 작성할 수 없습니다."
            );
        }

        // 검사 통과 후 등록
        CommentResponseDTO response = commentService.registerComment(requestDTO, postId, userId);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "댓글 삭제"
    )
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        commentService.deleteComment(commentId,userId);

        return ResponseEntity.ok(Map.of("message","댓글이 삭제되었습니다."));

    }

    @Operation(
            summary = "댓글 좋아요 누르기"
    )

    @PostMapping("/{commentId}/likes")
    public ResponseEntity<Map<String, Boolean>> toggleCommentLike(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal SecurityUser userDetails
    ) {
        Long userId = userDetails.getId();

        boolean liked = commentVoteService.toggleCommentLike(postId, commentId, userId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }


    @Operation(
            summary = "댓글 수정"
    )
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDTO requestDTO,
            @AuthenticationPrincipal SecurityUser userDetails
    ){
        Long userId = userDetails.getId();
        CommentResponseDTO response = commentService.updateComment(requestDTO,postId,userId,commentId);
        return ResponseEntity.ok(response);

    }

    @Operation(
            summary = "댓글 조회"
    )
    @GetMapping
    public Page<CommentResponseDTO> getComment(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){


        return commentService.getCommentByPostId(postId,page,size);
    }


}