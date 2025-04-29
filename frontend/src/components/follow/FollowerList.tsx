'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

interface Follower {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  hasFollowed: boolean; // 팔로우 상태 추가
}

export function FollowerList() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

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
            imageUrl: '/default-profile.png',
            hasFollowed: true, // 팔로워는 기본적으로 팔로우 중
          }))
        );
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchFollowers();
  }, [API_BASE]);

  // 팔로우 상태 변경 핸들러
  const handleFollowStatusChange = (userId: string, isFollowing: boolean) => {
    // 언팔로우 시 목록에서 제거
    if (!isFollowing) {
      setFollowers((prev) => prev.filter((f) => f.id !== userId));
    }
  };

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

  // 팔로워 목록 렌더링
  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {currentFollowers.length === 0 ? (
          <div className="flex items-center justify-center p-4 h-[72px]">
            <p className="text-gray-500">팔로워 목록이 없습니다.</p>
          </div>
        ) : (
          currentFollowers.map((f, idx) => (
            <div
              key={`follower-${f.id}-${idx}`}
              className={`flex items-center justify-between p-4 bg-white ${
                idx !== currentFollowers.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* 프로필 이미지 */}
                <Link href={`/blog/${f.id}`} className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={f.imageUrl}
                    alt={`${f.name}의 프로필`}
                    fill
                    sizes="(max-width: 768px) 100vw, 48px"
                    className="object-cover"
                    priority
                  />
                </Link>

                <Link href={`/blog/${f.id}`}>  {/* 유저 이름 클릭 시 상세 페이지로 이동 */}
                  <h3 className="font-medium text-gray-900 hover:text-[#78B3CE] transition-colors cursor-pointer">
                    {f.name}
                  </h3>
                </Link>
              </div>

              {/* 팔로우 버튼 컴포넌트 */}
              <FollowButton 
                userId={f.id} 
                initialHasFollowed={f.hasFollowed}
                onFollowStatusChange={(hasFollowed) => handleFollowStatusChange(f.id, hasFollowed)}
              />
            </div>
          ))
        )}
      </div>

      {/* 페이징 */}   
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 focus:outline-none"
            aria-label="이전 페이지"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageIndex = i + 1;
            return (
              <button
                key={`page-button-${pageIndex}`}
                onClick={() => handlePageChange(pageIndex)}
                className={`w-10 h-10 flex items-center justify-center rounded-full focus:outline-none ${
                  currentPage === pageIndex ? 'bg-gray-200 text-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label={`${pageIndex} 페이지`}
                aria-current={currentPage === pageIndex ? 'page' : undefined}
              >
                {pageIndex}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 focus:outline-none"
            aria-label="다음 페이지"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
} 