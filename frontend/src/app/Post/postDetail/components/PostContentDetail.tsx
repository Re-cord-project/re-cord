"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

// 임시 게시글 데이터 (실제로는 API를 통해 가져와야 함)
const posts: Record<
  string,
  {
    title: string;
    content: string;
    image?: string;
    imageAlt?: string;
    author: string;
    date: string;
    tags: string[];
  }
> = {
  "1": {
    title: "2024년 개발자로서의 첫 달을",
    content: `안녕하세요, 2024년 첫 달을 개발자로서 보낸 저의 경험을 공유하고자 합니다. 새해가 시작되면서 많은 목표와 계획을 세웠고, 그 중에서도 개발 역량 향상에 중점을 두었습니다. 이번 글에서는 제가 경험한 도전과 성장에 대해 이야기하려 합니다.

    1. 개발 환경 개선하기
    효율적인 개발을 위해 먼저 작업 환경을 개선했습니다. 듀얼 모니터에서 트리플 모니터로 업그레이드하고, 개발 생산성을 높이기 위한 다양한 도구와 플러그인을 설치했습니다. 특히 VS Code의 확장 프로그램들이 코딩 효율성을 크게 향상시켰습니다.`,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1469&auto=format&fit=crop",
    imageAlt: "개발 환경 셋업",
    author: "개발자",
    date: "2025.04.17 • 9:30 AM",
    tags: ["React", "개발환경", "웹 개발자성장기"],
  },
  "2": {
    title: "Next.js와 TypeScript로 블로그 만들기",
    content: `Next.js와 TypeScript를 활용하여 개인 블로그를 제작하는 과정과 경험을 공유합니다. 프로젝트를 시작하게 된 계기부터 완성까지의 과정을 상세히 설명합니다.

    1. 프로젝트 설정
    Next.js와 TypeScript를 사용하여 프로젝트를 시작하고, 필요한 의존성을 설치했습니다.

    2. 컴포넌트 설계
    재사용 가능한 컴포넌트를 설계하고 구현하여 효율적인 개발을 진행했습니다.`,
    author: "개발자",
    date: "2025.04.16 • 2:30 PM",
    tags: ["Next.js", "TypeScript", "웹 개발"],
  },
};

const PostContentDetail: React.FC = () => {
  const params = useParams();
  const postId = params.id as string;
  const post = posts[postId];
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        {/* 카테고리 추가 */}
        <span className="inline-block px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full mb-3">
          {post.tags[0]}
        </span>
        {/* 제목 크기 수정: text-xl → text-3xl */}
        <h2 className="text-3xl font-bold text-gray-800">{post.title}</h2>
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
              {post.author}
            </div>
            <div className="text-xs text-gray-500">{post.date}</div>
          </div>
        </div>
      </div>
      
      {/* 구분선 추가 */}
      <div className="border-t border-gray-200 mb-6" />

      <div className="prose max-w-none">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index} className="text-gray-700 text-sm leading-relaxed mb-4">
            {paragraph.trim()}
          </p>
        ))}
        {post.image && (
          <div className="my-6 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.imageAlt || "게시글 이미지"}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-6">
        {post.tags.map((tag, index) => (
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
