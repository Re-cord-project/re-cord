"use client";

import React, { useState } from "react";
import Link from "next/link";

// 임시 게시글 데이터
const posts = [
  {
    id: "1",
    title: "2024년 개발자로서의 첫 달을",
    content: `안녕하세요, 2024년 첫 달을 개발자로서 보낸 저의 경험을 공유하고자 합니다. 새해가 시작되면서 많은 목표와 계획을 세웠고, 그 중에서도 개발 역량 향상에 중점을 두었습니다.`,
    author: "개발자",
    date: "2025.04.17 • 9:30 AM",
    tags: ["React", "개발환경", "웹 개발자성장기"],
  },
  {
    id: "2",
    title: "Next.js와 TypeScript로 블로그 만들기",
    content: `Next.js와 TypeScript를 활용하여 개인 블로그를 제작하는 과정과 경험을 공유합니다. 프로젝트를 시작하게 된 계기부터 완성까지의 과정을 상세히 설명합니다.`,
    author: "개발자",
    date: "2025.04.16 • 2:30 PM",
    tags: ["Next.js", "TypeScript", "웹 개발"],
  },
  {
    id: "3",
    title: "리액트 컴포넌트 최적화 전략",
    content: `리액트 애플리케이션의 성능을 향상시키기 위한 다양한 최적화 전략을 소개합니다. memo, useMemo, useCallback 등의 활용법을 실제 사례와 함께 설명합니다.`,
    author: "개발자",
    date: "2025.04.15 • 4:15 PM",
    tags: ["React", "성능최적화", "프론트엔드"],
  },
  {
    id: "4",
    title: "GraphQL과 REST API 비교하기",
    content: `GraphQL과 REST API의 주요 차이점과 각각의 장단점을 실제 프로젝트 경험을 바탕으로 비교 분석합니다.`,
    author: "개발자",
    date: "2025.04.14 • 11:20 AM",
    tags: ["GraphQL", "REST API", "백엔드"],
  },
  {
    id: "5",
    title: "Docker를 이용한 개발 환경 구축",
    content: `Docker를 활용하여 일관된 개발 환경을 구축하는 방법과 팀 프로젝트에서의 실제 활용 사례를 공유합니다.`,
    author: "개발자",
    date: "2025.04.13 • 3:45 PM",
    tags: ["Docker", "DevOps", "개발환경"],
  },
  {
    id: "6",
    title: "웹 접근성 향상을 위한 가이드",
    content: `모든 사용자가 웹 콘텐츠에 쉽게 접근할 수 있도록 하기 위한 실질적인 가이드라인과 구현 방법을 소개합니다.`,
    author: "개발자",
    date: "2025.04.12 • 10:00 AM",
    tags: ["웹접근성", "HTML", "프론트엔드"],
  },
];

const POSTS_PER_PAGE = 4;

const PostContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // 현재 페이지에 보여줄 게시글 계산
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
  };

  return (
    <div>
      {/* 게시글 목록 */}
      {currentPosts.map((post) => (
        <Link href={`/Post/postDetail/${post.id}`} key={post.id}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
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

            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {post.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 ${
                    tag === "React" || tag === "Next.js"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  } rounded-full text-xs !rounded-button whitespace-nowrap`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostContent;
