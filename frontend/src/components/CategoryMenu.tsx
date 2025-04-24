import React from "react";

const CategoryMenu: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
      <ul className="text-sm">
        <li
          className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/category/dev-diary")}
        >
          <span className="text-gray-700">개발일지</span>
          <span className="text-gray-500 text-xs">42</span>
        </li>
        <li
          className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/category/programming")}
        >
          <span className="text-gray-700">프로그래밍 언어</span>
          <span className="text-gray-500 text-xs">28</span>
        </li>
        <li
          className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/category/web-dev")}
        >
          <span className="text-gray-700">웹 개발</span>
          <span className="text-gray-500 text-xs">19</span>
        </li>
        <li
          className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/category/database")}
        >
          <span className="text-gray-700">데이터베이스</span>
          <span className="text-gray-500 text-xs">15</span>
        </li>
        <li
          className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/category/server")}
        >
          <span className="text-gray-700">서버 관리</span>
          <span className="text-gray-500 text-xs">8</span>
        </li>
      </ul>
    </div>
  );
};

export default CategoryMenu;
