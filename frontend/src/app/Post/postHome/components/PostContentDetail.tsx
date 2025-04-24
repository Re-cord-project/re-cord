"use client";

import React, { useState, useEffect } from "react";

// Post 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
  author: string;
  date: string;
  tags: string[];
}

const PostContentDetail: React.FC = () => {
  // 실제로는 API에서 데이터를 가져올 것입니다
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 데이터 가져오기 시뮬레이션
  useEffect(() => {
    // 실제 API 호출 대신 임시 데이터 사용
    const fetchLatestPost = () => {
      const post: Post = {
        id: "1",
        title: "2024년 개발자로서의 첫 달을",
        content: `안녕하세요, 2024년 첫 달을 개발자로서 보낸 저의 경험을 공유하고자 합니다. 새해가 시작되면서 많은 목표와 계획을 세웠고, 그 중에서도 개발 역량 향상에 중점을 두었습니다...`,
        image:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1469&auto=format&fit=crop",
        imageAlt: "개발 환경 셋업",
        author: "개발자",
        date: "2025.04.17 • 9:30 AM",
        tags: ["React", "개발환경", "웹 개발자성장기"],
      };
      setLatestPost(post);
    };

    fetchLatestPost();
  }, []);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  if (!latestPost) {
    return <div>게시글을 불러오는 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full mb-3">
          {latestPost.tags[0]}
        </span>
        <h2 className="text-3xl font-bold text-gray-800">{latestPost.title}</h2>
        <div className="flex items-center mt-3">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer&width=100&height=100&seq=3&orientation=squarish"
              alt="작성자 프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">
              {latestPost.author}
            </div>
            <div className="text-xs text-gray-500">{latestPost.date}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mb-6" />

      <div className="prose max-w-none">
        {latestPost.content.split("\n").map((paragraph, index) => (
          <p key={index} className="text-gray-700 text-sm leading-relaxed mb-4">
            {paragraph.trim()}
          </p>
        ))}
        {latestPost.image && (
          <div className="my-6 rounded-lg overflow-hidden">
            <img
              src={latestPost.image}
              alt={latestPost.imageAlt || "게시글 이미지"}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-6">
        {latestPost.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 ${
              tag === "React" || tag === "Next.js"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            } rounded-full text-xs cursor-pointer !rounded-button whitespace-nowrap`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-center pt-6">
        <button
          onClick={handleLikeClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-blue-400 transition-colors"
        >
          <i
            className={`fas fa-heart ${
              isLiked ? "text-red-500" : "text-gray-400"
            }`}
          />
          <span className="text-sm text-gray-600">좋아요 {likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostContentDetail;
