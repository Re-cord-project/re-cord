"use client";

import React from "react";
import Head from "next/head";
import PostHeader from "../../../components/PostHeader";
import AuthorProfile from "../../../components/AuthorProfile";
import CategoryMenu from "../../../components/CategoryMenu";
import Statistics from "../../../components/Statistics";
import PostContentDetail from "../components/PostContentDetail";
import PostComments from "../components/PostComments";
import SearchBar from "../../../components/SearchBar";

// 임시 작성자 데이터 (실제로는 API를 통해 가져와야 함)
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>게시글 상세 - 개발자 블로그</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PostHeader />

      <div className="h-6" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-56">
          <AuthorProfile author={authorData} />
          <SearchBar />
          <CategoryMenu />
          <Statistics />
        </div>

        <div className="flex-1">
          <PostContentDetail />
          <div className="mt-8">
            <PostComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
