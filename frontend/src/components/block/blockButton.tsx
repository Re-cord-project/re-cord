'use client';

import { useState } from 'react';

interface BlockButtonProps {
  userId: number;
  isBlocked: boolean;
  variant?: 'button' | 'text';
  onBlockChange?: (isBlocked: boolean) => void;
}

export function BlockButton({ 
  userId, 
  isBlocked, 
  variant = 'button',
  onBlockChange 
}: BlockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const handleBlockAction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/block`, {
        method: isBlocked ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: userId }),
      });
      
      if (!res.ok) {
        console.error('차단 상태 변경 실패:', res.status);
        return;
      }
      
      if (onBlockChange) {
        onBlockChange(!isBlocked);
      }
    } catch (error) {
      console.error('차단 상태 변경 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 버튼 형태 스타일
  if (variant === 'button') {
    return (
      <button
        onClick={handleBlockAction}
        disabled={isLoading}
        className={`px-4 py-2 min-w-[85px] text-sm font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 ${
          isBlocked
            ? 'text-gray-700 bg-gray-100 hover:bg-red-100 hover:text-red-700'
            : 'text-white bg-red-500 hover:bg-red-600'
        }`}
      >
        {isLoading ? '처리 중...' : isBlocked ? '차단 해제' : '차단하기'}
      </button>
    );
  }

  // 텍스트 형태 스타일
  return (
    <button
      onClick={handleBlockAction}
      disabled={isLoading}
      className={`text-[12px] text-gray-400 hover:text-gray-500 transition-colors ${
        isBlocked ? 'text-gray-300' : ''
      }`}
    >
      {isLoading ? '처리 중...' : isBlocked ? '차단해제' : '차단하기'}
    </button>
  );
} 