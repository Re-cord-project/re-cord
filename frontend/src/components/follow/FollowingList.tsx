'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

interface Following {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  hasFollowed: boolean; // 내가 이 사용자를 팔로우하는지 여부 (백엔드 변경)
  blogName: string; // blogName 필드 추가
}

export function FollowingList() {
  const [followings, setFollowings] = useState<Following[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // 팔로잉 목록 가져오기
  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/followers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
        });

        // 팔로잉 목록을 가져오는 데 실패했을 경우
        if (!res.ok) {
          console.error('팔로잉 목록을 가져오는 데 실패했습니다:', res.status);
          return;
        }

        // 팔로잉 목록을 가져오는 데 성공했을 경우
        const data = await res.json();
        setFollowings(
          data.map((f: any, index: number) => ({
            id: String(f.userId),
            name: f.username,
            email: f.email,
            role: 'Unknown',
            imageUrl: '/default-profile.png',
            hasFollowed: f.hasFollowed || false, // 백엔드에서 hasFollowed 필드로 변경
            blogName: f.blogName || f.username, // blogName 추가
          }))
        );
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchFollowings();
  }, [API_BASE]);

  // 팔로우 상태 변경 핸들러
  const handleFollowStatusChange = (userId: string, isFollowing: boolean) => {
    setFollowings(prev => 
      prev.map(user => user.id === userId ? {...user, hasFollowed: isFollowing} : user)
    );
  };

  // 팔로잉 총 수
  const totalFollowings = followings.length;
  // 페이지당 팔로잉 수
  const itemsPerPage = 5;
  // 총 페이지 수
  const totalPages = Math.ceil(totalFollowings / itemsPerPage);

  const currentFollowings = followings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 팔로잉 목록 렌더링
  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {currentFollowings.length === 0 ? (
          <div className="flex items-center justify-center p-4 h-[72px]">
            <p className="text-gray-500">팔로잉 목록이 없습니다.</p>
          </div>
        ) : (
          currentFollowings.map((f, idx) => (
            <div
              key={`following-${f.id}-${idx}`}
              className={`flex items-center justify-between p-4 bg-white ${
                idx !== currentFollowings.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* 프로필 이미지 */}
                <Link href={`/blog/${f.blogName}`} className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={f.imageUrl}
                    alt={`${f.name}의 프로필`}
                    fill
                    sizes="(max-width: 768px) 100vw, 48px"
                    className="object-cover"
                    priority
                  />
                </Link>

                <Link href={`/blog/${f.blogName}`}>  {/* 유저 이름 클릭 시 상세 페이지로 이동 */}
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