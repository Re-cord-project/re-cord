'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Following {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

// 더 많은 팔로잉 데이터 생성
const MOCK_FOLLOWINGS: Following[] = [
  {
    id: '1',
    name: '김설계',
    role: '아키텍트',
    imageUrl: '/images/default-profile.png',
  },
  {
    id: '2',
    name: '이웹',
    role: '웹 개발자',
    imageUrl: '/images/default-profile.png',
  },
  {
    id: '3',
    name: '박모바일',
    role: '모바일 개발자',
    imageUrl: '/images/default-profile.png',
  },
  {
    id: '4',
    name: '최클라우드',
    role: '클라우드 엔지니어',
    imageUrl: '/images/default-profile.png',
  },
  {
    id: '5',
    name: '정인프라',
    role: '인프라 엔지니어',
    imageUrl: '/images/default-profile.png',
  },
];

export function FollowingList() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // 전체 팔로잉 수
  const totalFollowings = MOCK_FOLLOWINGS.length;
  // 한 페이지당 표시할 항목 수
  const itemsPerPage = 5;
  // 전체 페이지 수
  const totalPages = Math.ceil(totalFollowings / itemsPerPage);
  
  // 현재 페이지에 표시할 팔로잉 계산
  const currentFollowings = MOCK_FOLLOWINGS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {currentFollowings.map((following, index) => (
          <div
            key={following.id}
            className={`flex items-center justify-between p-4 bg-white ${
              index !== currentFollowings.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Link href={`/blog/${following.id}`}>
                  <Image
                    src={following.imageUrl}
                    alt={`${following.name}의 프로필 이미지`}
                    fill
                    className="object-cover cursor-pointer"
                  />
                </Link>
              </div>
              <div>
                <Link href={`/blog/${following.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#78B3CE] transition-colors cursor-pointer">{following.name}</h3>
                </Link>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-[#78B3CE] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#78B3CE]">
              팔로잉
            </button>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="이전 페이지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = 1;
            
            if (totalPages <= 5) {
              // 전체 페이지가 5개 이하면 1부터 순차적으로
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // 현재 페이지가 3 이하면 1~5 표시
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // 현재 페이지가 마지막에서 3번째 이내면 마지막 5개 표시
              pageNum = totalPages - 4 + i;
            } else {
              // 그 외의 경우 현재 페이지 중심으로 앞뒤 2개씩 표시
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  pageNum === currentPage ? 'bg-gray-200 text-gray-700' : 'hover:bg-gray-100 transition-colors'
                }`}
                aria-label={`${pageNum} 페이지`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="다음 페이지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 