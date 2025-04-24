'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">마이페이지</h2>
            <nav className="space-y-2">
              <Link
                href="/mypage/follower"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/mypage/follower'
                    ? 'bg-[#78B3CE] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                팔로워
              </Link>
              <Link
                href="/mypage/following"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/mypage/following'
                    ? 'bg-[#78B3CE] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                팔로잉
              </Link>
              <Link
                href="/mypage/block"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/mypage/block'
                    ? 'bg-[#78B3CE] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                차단 유저
              </Link>
            </nav>
          </div>
        </div>

        {/* 본문 컨텐츠 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 