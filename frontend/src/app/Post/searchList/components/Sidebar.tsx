import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <div className="w-full md:w-64 md:mr-8">
      {/* 프로필 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer%20with%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=200&height=200&seq=2&orientation=squarish"
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          <Link
            href="/mypage"
            className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
          >
            개발자
          </Link>
          <p className="text-xs text-gray-500 mt-1">소프트웨어 엔지니어</p>
          <div className="flex justify-between w-full mt-4 text-xs text-gray-600">
            <div className="text-center">
              <div className="font-bold">114</div>
              <div>팔로워</div>
            </div>
            <div className="text-center">
              <div className="font-bold">230</div>
              <div>팔로잉</div>
            </div>
            <div className="text-center">
              <div className="font-bold">45</div>
              <div>게시글</div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
            팔로우하기
          </button>
        </div>
      </div>
      {/* 카테고리 메뉴 */}
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
      {/* 통계 정보 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">통계</h3>
        <ul className="text-sm">
          <li className="py-1.5 flex justify-between">
            <span className="text-gray-700">총 방문자</span>
            <span className="text-gray-500">12,456</span>
          </li>
          <li className="py-1.5 flex justify-between">
            <span className="text-gray-700">오늘 방문자</span>
            <span className="text-gray-500">1,845</span>
          </li>
          <li className="py-1.5 flex justify-between">
            <span className="text-gray-700">어제의 방문자</span>
            <span className="text-gray-500">2,032</span>
          </li>
          <li className="py-1.5 flex justify-between">
            <span className="text-gray-700">이번 달 방문자</span>
            <span className="text-gray-500">14</span>
          </li>
          <li className="py-1.5 flex justify-between">
            <span className="text-gray-700">지난 달 방문자</span>
            <span className="text-gray-500">8,440</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
