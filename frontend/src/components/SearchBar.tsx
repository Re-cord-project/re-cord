"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 검색 기능 구현
    console.log("검색어:", searchTerm);
  };

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-400 text-sm text-gray-700 bg-white"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
        >
          <i className="fas fa-search text-sm"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
