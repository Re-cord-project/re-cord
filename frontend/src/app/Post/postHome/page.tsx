"use client";

import React from "react";
import Head from "next/head";
import PostHeader from "../../components/PostHeader";
import AuthorProfile from "../../components/AuthorProfile";
import CategoryMenu from "../../components/CategoryMenu";
import Statistics from "../../components/Statistics";
import PostContentDetail from "./components/PostContentDetail";
import PostComments from "./components/PostComments";
import AuthorOtherPosts from "./components/AuthorOtherPosts";
import SearchBar from "../../components/SearchBar";

// 임시 게시글 데이터 (컴포넌트 외부에서 정의)
const mockPosts = {
  "1": {
    title: "임시 게시글 1",
    content: "이것은 임시 게시글 내용입니다.",
    author: "임시 작성자",
    date: "2025.04.17",
  },
  "abc-123": {
    title: "또 다른 임시 게시글",
    content: "이것은 또 다른 임시 게시글 내용입니다.",
    author: "또 다른 작성자",
    date: "2025.04.16",
  },
};

const authorData = {
  name: "개발자",
  role: "소프트웨어 엔지니어",
  profileImage:
    "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer%20with%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=200&height=200&seq=2&orientation=squarish",
  stats: {
    followers: 114,
    following: 230,
    posts: 45,
  },
};

const SinglePostPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>2024년 개발자로서의 첫 달을 - 개발자 블로그</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Head>

      {/* 상단 네비게이션 바 */}
      <PostHeader />

      {/* 상단 여백 */}
      <div className="h-6" />

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
        {/* 좌측 사이드바 */}
        <div className="w-full md:w-56 md:mr-8">
          {/* 프로필 섹션 */}
          <AuthorProfile author={authorData} />
          {/* 검색바 추가 */}
          <SearchBar />
          {/* 카테고리 메뉴 */}
          <CategoryMenu />
          {/* 통계 정보 */}
          <Statistics />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 mt-6 md:mt-0">
          {/* 블로그 주인 소개 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              "{authorData.name}" 님의 최신 글을 읽어보세요
            </h1>
          </div>

          {/* 게시물 내용 */}
          <PostContentDetail />

          {/* 댓글 섹션 */}
          <PostComments />

          {/* 작성자의 다른 게시글 */}
          <AuthorOtherPosts />
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
