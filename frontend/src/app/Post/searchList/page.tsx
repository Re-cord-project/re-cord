"use client";

import React from "react";
import Head from "next/head";
import BlogHeader from "./components/BlogHeader";
import Banner from "./components/Banner";
import PostContent from "./components/PostContent";
import AuthorProfile from "../../components/AuthorProfile";
import CategoryMenu from "../../components/CategoryMenu";
import Statistics from "../../components/Statistics";
import SearchBar from "../../components/SearchBar";
import SearchResultHeader from "./components/SearchResultHeader";

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
const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("React");
  const [currentSort, setCurrentSort] = React.useState("latest");
  const [currentCategory, setCurrentCategory] = React.useState("all");
  const [totalResults, setTotalResults] = React.useState(42);

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />
      <Banner />
      <div className="h-6" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* 좌측 사이드바 */}
          <div className="w-full md:w-56 flex-shrink-0 md:mr-8">
            <AuthorProfile author={authorData} />
            <SearchBar />
            <CategoryMenu />
            <Statistics />
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 mt-6 md:mt-0">
            <SearchResultHeader
              searchQuery={searchQuery}
              totalResults={totalResults}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              currentCategory={currentCategory}
              onCategoryChange={setCurrentCategory}
            />
            <div className="bg-white rounded-lg shadow p-6 mt-4">
              <PostContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
