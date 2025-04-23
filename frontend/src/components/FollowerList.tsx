'use client'; // 이 줄을 추가하세요!

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Follower {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
}

export function FollowerList() {
  const [followers, setFollowers] = useState<Follower[]>([]); // 팔로워 목록 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
  
        // const res = await fetch('/api/users/follow', { //TODO : 배포 후 변경
        const res = await fetch('http://localhost:8090/api/users/follow', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include', // 쿠키 포함

        });

        if (res.ok) {
          const data = await res.json();
          setFollowers(data.map((follower: any) => ({
            id: String(follower.userId),
            name: follower.username,
            email: follower.email,
            role: 'Unknown', // 역할 정보는 제공되지 않아서 기본값 설정
            imageUrl: '/images/default-profile.png', // 기본 이미지 URL 사용
          })));
        } else {
          console.error('팔로워 목록을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchFollowers(); // 컴포넌트가 처음 렌더링될 때 API 호출
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 호출되도록 설정

  const totalFollowers = followers.length;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalFollowers / itemsPerPage);

  const currentFollowers = followers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {currentFollowers.map((follower, index) => (
          <div
            key={follower.id}
            className={`flex items-center justify-between p-4 bg-white ${
              index !== currentFollowers.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Link href={`/blog/${follower.id}`}>
                  <Image
                    src={follower.imageUrl}
                    alt={`${follower.name}의 프로필 이미지`}
                    fill
                    className="object-cover cursor-pointer"
                  />
                </Link>
              </div>
              <div>
                <Link href={`/blog/${follower.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#78B3CE] transition-colors cursor-pointer">{follower.name}</h3>
                </Link>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-[#78B3CE] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#78B3CE]">
              언팔로잉
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
            if (totalPages <= 5) pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${pageNum === currentPage ? 'bg-gray-200 text-gray-700' : 'hover:bg-gray-100 transition-colors'}`}
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
