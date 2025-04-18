"use client";

import React from "react";
import Link from "next/link";
import MonthlyViewsChart from "@/app/mypage/components/MonthlyViewsChart";
import PopularPosts from "@/app/mypage/components/PopularPosts";
import PopularComments from "@/app/mypage/components/PopularComments";

export default function StatisticsPage() {
  // 인기 게시물 데이터
  const popularPosts = [
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
  ];

  // 인기 댓글 데이터
  const popularComments = [
    {
      id: "1",
      user: {
        name: "프론트엔드개발자",
        avatar: "/avatars/user1.png",
      },
      text: "이 글 덕분에 React와 TypeScript 조합의 장점을 확실히 이해할 수 있었습니다. 감사합니다!",
      likes: 42,
      post: {
        title: "React와 TypeScript로 시작하는 웹 개발",
        slug: "react-typescript-web-development",
      },
      date: "2023-12-15",
    },
    {
      id: "2",
      user: {
        name: "웹성능마스터",
        avatar: "/avatars/user2.png",
      },
      text: "성능 최적화 부분에서 메모이제이션 관련 팁이 정말 도움 됐어요. 제 프로젝트에 바로 적용해봤는데 확실히 차이가 느껴집니다.",
      likes: 38,
      post: {
        title: "JavaScript 성능 최적화 팁",
        slug: "javascript-performance-tips",
      },
      date: "2023-11-28",
    },
    {
      id: "3",
      user: {
        name: "디자인러버",
        avatar: "/avatars/user3.png",
      },
      text: "Grid 레이아웃의 auto-fill과 auto-fit의 차이를 이해하기 쉽게 설명해주셔서 감사합니다.",
      likes: 33,
      post: {
        title: "CSS Grid 완벽 가이드",
        slug: "css-grid-complete-guide",
      },
      date: "2024-01-05",
    },
    {
      id: "4",
      user: {
        name: "넥스트개발자",
        avatar: "/avatars/user4.png",
      },
      text: "App Router와 Page Router의 차이점을 명확하게 설명해주셔서 도움이 많이 됐습니다. 전환할 때 참고할게요!",
      likes: 29,
      post: {
        title: "Next.js 13 새로운 기능 소개",
        slug: "nextjs-13-new-features",
      },
      date: "2024-02-12",
    },
    {
      id: "5",
      user: {
        name: "접근성전문가",
        avatar: "/avatars/user5.png",
      },
      text: "ARIA 속성을 이렇게 체계적으로 정리한 글은 처음 봤어요. 북마크 해두고 계속 참고하겠습니다.",
      likes: 26,
      post: {
        title: "웹 접근성 향상을 위한 ARIA 속성",
        slug: "web-accessibility-aria",
      },
      date: "2024-03-01",
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-black">통계</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">활동 통계</h2>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/mypage/statistics/posts" className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">총 글</p>
              <p className="text-3xl font-bold text-black">42</p>
            </div>
          </Link>

          <Link href="/mypage/statistics/comments" className="block">
            <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">총 댓글</p>
              <p className="text-3xl font-bold text-black">196</p>
            </div>
          </Link>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500 mb-1">총 조회수</p>
            <p className="text-3xl font-bold text-black">1,234</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">월간 조회수 추이</h2>

        <div className="bg-white p-4 rounded shadow h-64">
          <MonthlyViewsChart />
        </div>
      </div>

      {/* 인기 게시물 섹션 */}
      <PopularPosts posts={popularPosts} />

      {/* 인기 댓글 섹션 */}
      <PopularComments comments={popularComments} />
    </>
  );
}
