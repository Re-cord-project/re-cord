'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RecentPosts from '@/components/home/RecentPosts'; 
import WeeklyPopularPosts from '@/components/home/WeeklyPopularPosts';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center bg-gradient-to-r from-[#5A8BA6] to-[#78B3CE]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <Image src="/image/office-background.jpg" alt="Office background" layout="fill" objectFit="cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h2 className="text-2xl font-bold mb-2">당신의 성장을 기록하세요</h2>
          <p className="mb-6 text-sm">개발블로그에서의 모든 순간을 확인하고 공유하세요</p>
          <button className="px-4 py-2 bg-[#78B3CE] rounded-md text-sm font-medium">시작하기</button>
        </div>
      </section>

      {/* Search Bar 수정 */}
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-1/3">
          <div className="flex flex-1 items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 focus:outline-none text-sm bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#78B3CE] text-white rounded-md text-sm hover:bg-[#5A8BA6] transition-colors"
          >
            검색
          </button>
        </form>
      </div>


      {/* 최근 올라온 회고록 */}
      <RecentPosts />

      {/* 이번 주 인기 회고록 */}
      <WeeklyPopularPosts />

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-[#78B3CE] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#5A8BA6] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
