'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, CornerDownRight } from 'lucide-react';

type Comment = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  updateStatus: 'EDITED' | 'NOT_EDITED' | 'TEMP_SAVED' | 'UPDATED';
  profileImageUrl?: string;
  parentId: number | null;
  replies: Comment[];
  isDeleted?: boolean;
  likes?: number;
};

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8090/api/posts/${postId}/comments?page=${page}&size=10&sort=createdAt,asc`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => {
        fetchComments();
      });
  }, [postId, page]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const res = await fetch(`http://localhost:8090/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      setNewComment('');
      fetchComments();
    } else {
      alert('댓글 작성 실패!');
    }
  };

  const fetchComments = () => {
    fetch(`http://localhost:8090/api/posts/${postId}/comments?page=${page}&size=5&sort=createdAt,asc`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.content);
        setTotalPages(data.totalPages);
        setTotalComments(data.totalElements);
      });
  };

  const handleDelete = async (commentId: number) => {
    const confirmDelete = confirm('정말 이 댓글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:8090/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      fetchComments();
    } else {
      alert('댓글 삭제 실패!');
    }
  };

  const handleUpdate = async (commentId: number) => {
    const res = await fetch(`http://localhost:8090/api/posts/${postId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: editedContent }),
    });

    if (res.ok) {
      fetchComments();
      setEditingCommentId(null);
      setEditedContent('');
    } else {
      alert('댓글 수정 실패!');
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyContent.trim()) return;

    const res = await fetch(`http://localhost:8090/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: replyContent, parentId }),
    });

    if (res.ok) {
      setReplyContent('');
      setReplyingToId(null);
      fetchComments();
    } else {
      alert('대댓글 작성 실패!');
    }
  };

  const handleToggleLike = async (commentId: number) => {
  const res = await fetch(`http://localhost:8090/api/posts/${postId}/comments/${commentId}/likes`, {
    method: 'POST',
    credentials: 'include',
  });

  if (res.ok) {
    const { liked } = await res.json(); // 백엔드가 { liked: true/false } 형태로 응답한다고 가정
    alert(liked ? '추천했습니다.' : '추천을 취소했습니다.');
    fetchComments(); // 갱신
  } else {
    alert('추천 처리에 실패했습니다.');
  }
};

  

  const renderComment = (comment: Comment, indent = 0) => (
    <div key={comment.id} className={`flex flex-col ${indent === 0 ? 'border-t border-gray-200 pt-4 pb-2' : 'ml-12 pb-4'}`}>
    

      <div className="flex items-center gap-2 mb-1 justify-between">
        <div className="flex gap-3 items-center">
          {indent > 0 && <CornerDownRight size={16} className="text-gray-400" />}
          <img
            src={comment.profileImageUrl || "/default-profile.png"}
            alt="프로필"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold">{comment.username}</div>
            <div className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              })}
              {comment.updateStatus === 'EDITED' && (
                <span className="ml-1 text-[11px] text-[#78B3CE]">(수정됨)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          {!comment.isDeleted && (
            <>
              {/* 🔧 추천 버튼 추가 */}
              <button
                onClick={() => handleToggleLike(comment.id)} // 추천 처리 함수 연결
                className="flex items-center gap-1 text-[#78B3CE] hover:underline"
              >
                <ThumbsUp size={16} />
                추천 {comment.likes ?? 0}
              </button>

              {/* 기존 수정 버튼 */}
              <button
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditedContent(comment.content);
                }}
                className="text-[#78B3CE] hover:underline"
              >수정</button>

              {/* 기존 삭제 버튼 */}
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:underline"
              >삭제</button>
            </>
          )}
        </div>

      </div>

      {editingCommentId === comment.id ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingCommentId(null)} className="text-gray-400 text-xs">취소</button>
            <button onClick={() => handleUpdate(comment.id)} className="bg-[#78B3CE] text-white px-3 py-1 text-xs rounded hover:bg-[#5A8BA6]">저장</button>
          </div>
        </div>
      ) : (
        <p className={`text-sm text-gray-800 ${indent > 0 ? 'ml-18' : 'ml-12'}`}>
          {comment.isDeleted ? '삭제된 댓글입니다.' : comment.content}
        </p>

      )}

      {/* 답글 버튼은 삭제되지 않은 부모 댓글에만 표시하도록 수정 */}

      {indent === 0 && (
        <div className="text-sm mt-2 h-5"> {/* ← 항상 일정한 높이 유지! */}
          {!comment.isDeleted && comment.content !== '삭제된 댓글입니다.' && (
            <button
            onClick={() => setReplyingToId(comment.id)}
            className="text-black bg-white border border-gray-300 text-xs px-2 py-[3px] rounded hover:bg-gray-100 transition">
            답글
          </button>

          )}
        </div>
      )}


      {replyingToId === comment.id && (
        <div className={`mt-2 ${indent > 0 ? 'ml-6' : ''}`}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-sm"
            placeholder="대댓글을 입력하세요"
          />
          <div className="mt-1 text-right">
            <button
              onClick={() => handleReplySubmit(comment.id)}
              className="bg-[#78B3CE] text-white px-3 py-1 rounded hover:bg-[#5A8BA6] text-xs"
            >등록</button>
          </div>
        </div>
      )}

      {comment.replies?.map(reply => renderComment(reply, 8))}
    </div>
  );

  return (
    <div className="mt-10 border-t border-gray-200 pt-6 w-full max-w-4xl mx-auto">
      <h4 className="text-lg font-semibold mb-4">댓글 {totalComments}개</h4>

      <div className="space-y-6 w-full">
        {comments.map(comment => renderComment(comment))}
      </div>

      <div className="mt-6 w-full">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성해주세요"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#78B3CE]"
        />
        <div className="mt-2 text-right">
          <button
            onClick={handleSubmit}
            className="bg-[#78B3CE] text-white px-4 py-2 rounded-md hover:bg-[#5A8BA6] text-sm"
          >댓글 작성</button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded ${i === page ? 'bg-[#78B3CE] text-white' : 'bg-gray-100 text-gray-700'}`}
          >{i + 1}</button>
        ))}
      </div>
    </div>
  );
}
