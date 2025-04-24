import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const AuthorOtherPosts: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        작성자의 다른 게시글
      </h3>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/post/3")}
        >
          <div>
            <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">
              Next.js 13 버전에서 달라진 점 정리
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              2025.04.15 • 조회 245
            </div>
          </div>
          <div className="text-xs text-gray-500">댓글 8</div>
        </div>

        <div
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/post/4")}
        >
          <div>
            <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">
              TypeScript 고급 기능 활용하기
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              2025.04.12 • 조회 189
            </div>
          </div>
          <div className="text-xs text-gray-500">댓글 5</div>
        </div>

        <div
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/post/5")}
        >
          <div>
            <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">
              React Query로 상태관리 최적화하기
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              2025.04.10 • 조회 312
            </div>
          </div>
          <div className="text-xs text-gray-500">댓글 12</div>
        </div>

        <div
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/post/6")}
        >
          <div>
            <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">
              Docker를 이용한 개발 환경 구축하기
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              2025.04.08 • 조회 278
            </div>
          </div>
          <div className="text-xs text-gray-500">댓글 15</div>
        </div>

        <div
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => (window.location.href = "/post/7")}
        >
          <div>
            <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">
              CI/CD 파이프라인 구축 경험 공유
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              2025.04.05 • 조회 156
            </div>
          </div>
          <div className="text-xs text-gray-500">댓글 6</div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Link
          href="/author-posts"
          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap"
        >
          더 많은 게시글 보기{" "}
          <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default AuthorOtherPosts;
