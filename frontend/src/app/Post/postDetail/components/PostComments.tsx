"use client";

import React, { useState } from "react";

interface Comment {
  author: string;
  authorImageUrl: string;
  date: string;
  content: string;
  replies: Comment[];
}

const PostComments: React.FC = () => {
  const [commentText, setCommentText] = useState<string>("");
  const comments: Comment[] = [
    {
      author: "사용자",
      authorImageUrl:
        "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20female%20with%20short%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=100&height=100&seq=5&orientation=squarish",
      date: "2025.04.17 • 11:30 AM",
      content:
        "정말 좋은 글이네요! 저도 개발 환경을 개선하고 싶은데 추천해주실 만한 모니터가 있을까요?",
      replies: [],
    },
  ];

  const handleCommentSubmit = () => {
    // 댓글 작성 로직 (API 호출 등)
    console.log("댓글 작성:", commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        댓글 ({comments.length}개)
      </h3>
      {/* 댓글 목록 */}
      {comments.map((comment, index) => (
        <div key={index} className="border-b pb-4 mb-4">
          <div className="flex">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img
                src={comment.authorImageUrl}
                alt={comment.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {comment.author}
                  </div>
                  <div className="text-xs text-gray-500">{comment.date}</div>
                </div>
                <div className="text-xs text-gray-500">답글 (0)</div>
              </div>
              <p className="text-sm text-gray-700 mt-2">{comment.content}</p>
              {/* 답글 기능 구현은 생략 */}
            </div>
          </div>
        </div>
      ))}
      {/* 댓글 입력 */}
      <div>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="댓글을 작성하세요..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
            onClick={handleCommentSubmit}
          >
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
