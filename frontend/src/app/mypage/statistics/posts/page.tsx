"use client";

import React, { useState } from "react";
import Link from "next/link";

// 임시 게시글 데이터 (실제로는 API에서 가져올 것입니다)
const userPosts = [
  {
    id: "1",
    title: "React와 TypeScript로 시작하는 웹 개발",
    views: 342,
    likes: 87,
    comments: 53,
    slug: "react-typescript-web-development",
    date: "2023-12-10",
  },
  {
    id: "2",
    title: "JavaScript 성능 최적화 팁",
    views: 287,
    likes: 65,
    comments: 41,
    slug: "javascript-performance-tips",
    date: "2024-01-15",
  },
  {
    id: "3",
    title: "CSS Grid 완벽 가이드",
    views: 245,
    likes: 58,
    comments: 37,
    slug: "css-grid-complete-guide",
    date: "2024-02-05",
  },
  {
    id: "4",
    title: "Next.js 13 새로운 기능 소개",
    views: 198,
    likes: 43,
    comments: 28,
    slug: "nextjs-13-new-features",
    date: "2024-02-20",
  },
  {
    id: "5",
    title: "웹 접근성 향상을 위한 ARIA 속성",
    views: 176,
    likes: 39,
    comments: 21,
    slug: "web-accessibility-aria",
    date: "2024-03-08",
  },
  {
    id: "6",
    title: "모던 CSS 테크닉 10가지",
    views: 155,
    likes: 32,
    comments: 18,
    slug: "modern-css-techniques",
    date: "2024-03-15",
  },
  {
    id: "7",
    title: "React Query로 상태 관리 최적화하기",
    views: 132,
    likes: 27,
    comments: 15,
    slug: "react-query-state-management",
    date: "2024-03-22",
  },
];

export default function UserPostsPage() {
  const [sortType, setSortType] = useState<"date" | "views">("date");

  // 정렬된 게시글 목록
  const sortedPosts = [...userPosts].sort((a, b) => {
    if (sortType === "views") {
      return b.views - a.views; // 조회수 내림차순 (인기순)
    } else {
      // 날짜 내림차순 (최신순)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">
          내 게시글 ({userPosts.length})
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
            onClick={() => setSortType("views")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              sortType === "views"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                좋아요
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                댓글
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {post.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {post.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {post.likes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {post.comments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div className="flex justify-center gap-4">
                    <Link
                      href={`/edit-post/${post.id}`}
                      className="bg-blue-500 text-white hover:bg-blue-600 py-1 px-3 rounded transition-colors font-medium"
                    >
                      수정
                    </Link>
                    <button className="bg-red-500 text-white hover:bg-red-600 py-1 px-3 rounded transition-colors font-medium">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
