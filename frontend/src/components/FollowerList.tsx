'use client';

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
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 팔로워 목록 가져오기
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/follow`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
        });

        // 팔로워 목록을 가져오는 데 실패했을 경우
        if (!res.ok) {
          console.error('팔로워 목록을 가져오는 데 실패했습니다:', res.status);
          return;
        }

        // 팔로워 목록을 가져오는 데 성공했을 경우
        const data = await res.json();
        setFollowers(
          data.map((f: any) => ({
            id: String(f.userId),
            name: f.username,
            email: f.email,
            role: 'Unknown',
            imageUrl: '/images/default-profile.png',
          }))
        );
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    // 팔로워 목록 가져오기
    fetchFollowers();
  }, [API_BASE]);

  // 팔로워 총 수
  const totalFollowers = followers.length;
  // 페이지당 팔로워 수
  const itemsPerPage = 5;
  // 총 페이지 수
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
        {currentFollowers.map((follower, idx) => (
          <div
            key={follower.id}
            className={`flex items-center justify-between p-4 bg-white ${
              idx !== currentFollowers.length - 1 ? 'border-b border-gray-200' : ''
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
                    priority
                  />
                </Link>
              </div>
              <div>
                <Link href={`/blog/${follower.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#78B3CE] transition-colors cursor-pointer">
                    {follower.name}
                  </h3>
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
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            aria-label="이전 페이지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  pageNum === currentPage ? 'bg-gray-200 text-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label={`${pageNum} 페이지`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
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