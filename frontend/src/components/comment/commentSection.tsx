// components/comment/CommentSection.tsx

'use client';

import { useEffect, useState } from 'react';

type Comment = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
};

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${postId}/comments?page=0&size=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.content);
      });
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await fetch(`http://localhost:8090/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment('');
    location.reload(); // 간단하게 새로고침으로 리로드
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-semibold mb-4">댓글 {comments.length}개</h4>

      {/* 댓글 리스트 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col border-b pb-4 border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-semibold">{comment.username}</div>
              <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</div>
            </div>
            <p className="text-sm text-gray-800">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* 댓글 작성 */}
      <div className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성해주세요"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="mt-2 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
          >
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
}
