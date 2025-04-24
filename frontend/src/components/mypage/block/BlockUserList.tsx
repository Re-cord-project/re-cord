'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  reason: string;
  imageUrl: string;
}

export function BlockUserList() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // 차단된 유저 목록 가져오기
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/block`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
        });

        // 차단 목록을 가져오는 데 실패했을 경우
        if (!res.ok) {
          console.error('차단 목록을 가져오는 데 실패했습니다:', res.status);
          // 임시 데이터로 대체 (백엔드 API 완성 전까지)
          setBlockedUsers([
            {
              id: '1',
              name: '스팸유저1',
              email: 'spam1@example.com',
              reason: '스팸 메시지 발송',
              imageUrl: '/default-profile.png',
            },
            {
              id: '2',
              name: '악성댓글러',
              email: 'bad@example.com',
              reason: '악성 댓글 작성',
              imageUrl: '/default-profile.png',
            },
            {
              id: '3',
              name: '광고봇',
              email: 'adbot@example.com',
              reason: '광고성 컨텐츠 게시',
              imageUrl: '/default-profile.png',
            },
          ]);
          return;
        }

        // 차단 목록을 가져오는 데 성공했을 경우
        const data = await res.json();
        setBlockedUsers(
          data.map((u: any, index: number) => ({
            id: String(u.userId),
            name: u.username,
            email: u.email,
            reason: u.blockReason || '사용자에 의한 차단',
            imageUrl: '/default-profile.png',
          }))
        );
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        // 임시 데이터 (에러 발생 시)
        setBlockedUsers([
          {
            id: '1',
            name: '스팸유저1',
            email: 'spam1@example.com',
            reason: '스팸 메시지 발송',
            imageUrl: '/default-profile.png',
          }
        ]);
      }
    };

    fetchBlockedUsers();
  }, [API_BASE]);

  // 차단 해제 처리
  const handleUnblock = async (userId: string) => {
    try {
      // DELETE 요청
      const res = await fetch(`${API_BASE}/api/users/block`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedUserId: Number(userId) }),
      });
      
      if (!res.ok) {
        console.error('차단 해제 실패:', res.status);
        return;
      }
      
      // UI 업데이트, 해당 항목 제거
      setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('차단 해제 중 오류 발생:', error);
    }
  };

  // 차단 유저 총 수
  const totalBlockedUsers = blockedUsers.length;
  // 페이지당 차단 유저 수
  const itemsPerPage = 5;
  // 총 페이지 수
  const totalPages = Math.ceil(totalBlockedUsers / itemsPerPage);

  const currentBlockedUsers = blockedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 차단 유저 목록 렌더링
  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {currentBlockedUsers.map((user, idx) => (
          <div
            key={`blocked-user-${user.id}-${idx}`}
            className={`flex items-center justify-between p-4 bg-white ${
              idx !== currentBlockedUsers.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* 프로필 이미지 */}
              <Link href={`/blog/${user.id}`} className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={user.imageUrl}
                  alt={`${user.name}의 프로필`}
                  fill
                  sizes="(max-width: 768px) 100vw, 48px"
                  className="object-cover"
                  priority
                />
              </Link>

              <div>
                <Link href={`/blog/${user.id}`}>  {/* 유저 이름 클릭 시 상세 페이지로 이동 */}
                  <h3 className="font-medium text-gray-900 hover:text-[#78B3CE] transition-colors cursor-pointer">
                    {user.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500">{user.reason}</p>
              </div>
            </div>

            {/* 차단 해제 버튼 */}
            <button
              onClick={() => handleUnblock(user.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-[#78B3CE] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#78B3CE]"
            >
              차단 해제
            </button>
          </div>
        ))}
      </div>

      {/* 페이징 */}   
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
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
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
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
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            aria-label="다음 페이지"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
} 