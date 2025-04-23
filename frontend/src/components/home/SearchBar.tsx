'use client';

import { useState, FormEvent } from 'react';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // 👉 이 부분에 검색 API 연동 or 라우터 이동 추가 가능
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSearch} className="flex items-center justify-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            className="w-full p-3 pl-10 border border-gray-300 rounded-md"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button type="submit" className="ml-2 px-4 py-2.5 bg-[#78B3CE] text-white rounded-md">
          검색
        </button>
      </form>
    </div>
  );
}
