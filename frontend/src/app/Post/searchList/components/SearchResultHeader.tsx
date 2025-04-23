import React from "react";

interface SearchResultHeaderProps {
  searchQuery: string;
  totalResults: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({
  searchQuery,
  totalResults,
  currentSort,
  onSortChange,
  currentCategory,
  onCategoryChange,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">"{searchQuery}" 검색결과</h1>
      <p className="text-gray-600 mb-4">총 {totalResults}건의 검색결과</p>

      <div className="flex gap-4">
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="popular">인기순</option>
        </select>

        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={currentCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">전체 카테고리</option>
          <option value="web">웹 개발</option>
          <option value="mobile">모바일 개발</option>
          <option value="backend">백엔드</option>
          <option value="frontend">프론트엔드</option>
        </select>
      </div>
    </div>
  );
};

export default SearchResultHeader;
