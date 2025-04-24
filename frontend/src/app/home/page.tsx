'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import NewPostList from '@/components/newPostList';
import { Navigator } from '@/components/Navigator';


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data based on the image
  const newCourses = [
    { id: 1, category: 'React', duration: '3기', title: '리액트 컴포넌트 설계 고민했던 경험', instructor: '이프론트', views: 128 },
    { id: 2, category: 'Spring', duration: '4기', title: 'JPA 연관관계 매핑 트러블슈팅', instructor: '백엔드만', views: 95 },
    { id: 3, category: 'UI/UX', duration: '2기', title: '사용자 중심의 UI 디자인 관점', instructor: '최디자인', views: 156 },
    { id: 4, category: 'DevOps', duration: '2기', title: 'AWS 배포 자동화 구축기', instructor: '정데옵스', views: 142 },
  ];
  
  const recommendedCourses = [
    { id: 5, category: '팀 프로젝트', duration: '4기', title: '첫 팀 프로젝트 회고', instructor: '김팀장', likes: 234, comments: 45 },
    { id: 6, category: '알고리즘', duration: '3기', title: '알고리즘 마스터 되기', instructor: '이알고', likes: 198, comments: 32 },
    { id: 7, category: '모바일', duration: '2기', title: 'React Native로 앱 개발하기', instructor: '박모바일', likes: 167, comments: 28 },
    { id: 8, category: 'AI/ML', duration: '2기', title: '머신러닝 프로젝트 도전기', instructor: '최머신', likes: 145, comments: 29 },
  ];
  
  const bootcampPosts = [
    { id: 9, title: '프론트엔드 개발자로 성장하기', author: '코드랩 6기', date: '2024.03.15' },
    { id: 10, title: '팀 프로젝트에서 배운 실패', author: '코드랩 6기', date: '2024.03.14' },
    { id: 11, title: '백엔드 개발 실전 프로젝트', author: '코드랩 6기', date: '2024.03.13' },
    { id: 12, title: '모바일 앱 개발 도전기', author: '코드랩 6기', date: '2024.03.12' },
    { id: 13, title: '클라우드 서비스 구축 경험', author: '코드랩 6기', date: '2024.03.11' },
    { id: 14, title: 'UI/UX 디자인 프로세스', author: '코드랩 6기', date: '2024.03.10' },
  ];

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-[#78B3CE] font-bold text-xl mr-4">RE:cord</h1>
            <button className="text-sm px-2 py-1 border border-gray-300 rounded-md">내 블로그</button>
          </div>
          <div className="flex items-center">
            <button className="relative mr-2">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">1</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="px-3 py-1 bg-[#78B3CE] text-white rounded-md text-sm">김개발</button>
          </div>
        </div>
      </header>

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

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <SearchBar/>
      </div>

      {/* New Courses Section */}
      <NewPostList courses={newCourses} />
      
      {/* Recommended Courses Section */}
      <section className="container mx-auto px-4 py-6">
        <h3 className="text-xl font-bold mb-6">이런 주 인기 회고록</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 bg-gray-200 relative">
                {/* Replace with actual images */}
                <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {course.category} · {course.duration}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-sm mb-4">{course.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-xs text-gray-600">{course.instructor}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {course.likes}
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {course.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bootcamp Section */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-bold mb-6">지금 핫한 부트캠프 회고</h3>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button className="px-4 py-2 text-sm font-medium text-[#78B3CE] border-b-2 border-[#78B3CE]">코드랩</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500">항해99</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500">네이버 부스트캠프</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500">우아한테크코스</button>
          </div>
        </div>
        
        {/* Bootcamp Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bootcampPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                {/* Replace with actual images */}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-sm mb-3">{post.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">더보기</button>
        </div>
      </section>
      
      {/* Float Button */}
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
