'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Navigator() {
  const pathname = usePathname();
  
  // 현재 경로에 따라 활성화된 메뉴 결정
  const isHome = pathname === '/';
  const isBlog = pathname.includes('/blog') || pathname.includes('/mypage');
  
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="w-full mx-auto px-[100px] h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center h-16">
            <div className="relative w-[88px] h-[88px] -my-8">
              <Image
                src="/logo.png"
                alt="RE:cord 로고"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center h-16">
            <Link 
              href="/" 
              className={`relative h-full flex items-center px-3 ${isHome ? 'font-bold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              홈
              {isHome && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"></div>}
            </Link>
            <Link 
              href="/blog" 
              className={`relative h-full flex items-center px-3 ${isBlog ? 'font-bold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              내 블로그
              {isBlog && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"></div>}
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/notifications" className="relative p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
              <span className="text-xs font-medium text-white">3</span>
            </div>
          </Link>
          <Link 
            href="/mypage" 
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full py-1 px-2 transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/images/default-profile.png"
                alt="프로필 이미지"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-900">김개발</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 