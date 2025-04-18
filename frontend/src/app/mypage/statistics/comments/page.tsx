"use client";

import React, { useState } from "react";
import Link from "next/link";

// 임시 댓글 데이터 (실제로는 API에서 가져올 것입니다)
const userComments = [
  {
    id: "1",
    text: "이 글 덕분에 React와 TypeScript 조합의 장점을 확실히 이해할 수 있었습니다. 감사합니다!",
    post: {
      title: "React와 TypeScript로 시작하는 웹 개발",
      slug: "react-typescript-web-development",
    },
    likes: 42,
    date: "2023-12-15",
  },
  {
    id: "2",
    text: "성능 최적화 부분에서 메모이제이션 관련 팁이 정말 도움 됐어요. 제 프로젝트에 바로 적용해봤는데 확실히 차이가 느껴집니다.",
    post: {
      title: "JavaScript 성능 최적화 팁",
      slug: "javascript-performance-tips",
    },
    likes: 38,
    date: "2023-11-28",
  },
  {
    id: "3",
    text: "Grid 레이아웃의 auto-fill과 auto-fit의 차이를 이해하기 쉽게 설명해주셔서 감사합니다.",
    post: {
      title: "CSS Grid 완벽 가이드",
      slug: "css-grid-complete-guide",
    },
    likes: 33,
    date: "2024-01-05",
  },
  {
    id: "4",
    text: "App Router와 Page Router의 차이점을 명확하게 설명해주셔서 도움이 많이 됐습니다. 전환할 때 참고할게요!",
    post: {
      title: "Next.js 13 새로운 기능 소개",
      slug: "nextjs-13-new-features",
    },
    likes: 29,
    date: "2024-02-12",
  },
  {
    id: "5",
    text: "ARIA 속성을 이렇게 체계적으로 정리한 글은 처음 봤어요. 북마크 해두고 계속 참고하겠습니다.",
    post: {
      title: "웹 접근성 향상을 위한 ARIA 속성",
      slug: "web-accessibility-aria",
    },
    likes: 26,
    date: "2024-03-01",
  },
  {
    id: "6",
    text: "특히 :where와 :is 선택자 부분이 유용했습니다. CSS 선택자 성능에 대한 부분도 좀 더 자세히 다뤄주시면 좋을 것 같아요.",
    post: {
      title: "모던 CSS 테크닉 10가지",
      slug: "modern-css-techniques",
    },
    likes: 21,
    date: "2024-03-16",
  },
  {
    id: "7",
    text: "React Query 도입 후 상태 관리가 훨씬 간결해졌습니다. 캐싱 정책 설정 방법에 대해 좀 더 심층적인 내용이 있으면 좋겠네요.",
    post: {
      title: "React Query로 상태 관리 최적화하기",
      slug: "react-query-state-management",
    },
    likes: 18,
    date: "2024-03-23",
  },
  {
    id: "8",
    text: "예제 코드도 깔끔하고 설명도 명확해서 많은 도움이 됐습니다. 다음에는 비동기 처리에 관한 글도 써주시면 좋겠어요!",
    post: {
      title: "JavaScript 프로미스 제대로 이해하기",
      slug: "javascript-promises-deep-dive",
    },
    likes: 15,
    date: "2024-03-25",
  },
];

export default function UserCommentsPage() {
  const [sortType, setSortType] = useState<"date" | "likes">("date");

  // 정렬된 댓글 목록
  const sortedComments = [...userComments].sort((a, b) => {
    if (sortType === "likes") {
      return b.likes - a.likes; // 좋아요 내림차순 (인기순)
    } else {
      // 날짜 내림차순 (최신순)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">
          내 댓글 ({userComments.length})
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSortType("date")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              sortType === "date"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortType("likes")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              sortType === "likes"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-start">
              <div className="flex-1 pr-6">
                <Link
                  href={`/post/${comment.post.slug}#comment-${comment.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  <p className="text-sm mb-2 text-black hover:underline">
                    {comment.text}
                  </p>
                </Link>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="text-xs text-gray-500">
                      {comment.date}
                    </span>
                    <div className="flex items-center ml-3">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {comment.likes}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">게시글: </span>
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {comment.post.title}
                  </Link>
                </p>
              </div>
              <button className="bg-red-500 text-white hover:bg-red-600 py-1.5 px-4 rounded transition-colors text-sm font-medium flex-shrink-0">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
