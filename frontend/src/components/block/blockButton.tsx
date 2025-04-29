'use client';

import { useState } from 'react';

interface BlockButtonProps {
  userId: string;
  initialIsBlocked: boolean;
  onBlockStatusChange?: (isBlocked: boolean) => void;
}

export function BlockButton({ userId, initialIsBlocked, onBlockStatusChange }: BlockButtonProps) {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // 차단 처리
  const handleBlock = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/block`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: Number(userId) }),
      });
      
      if (!res.ok) {
        console.error('차단 실패:', res.status);
        return;
      }
      
      setIsBlocked(true);
      if (onBlockStatusChange) {
        onBlockStatusChange(true);
      }
    } catch (error) {
      console.error('차단 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 차단 해제 처리
  const handleUnblock = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/block`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: Number(userId) }),
      });
      
      if (!res.ok) {
        console.error('차단 해제 실패:', res.status);
        return;
      }
      
      setIsBlocked(false);
      if (onBlockStatusChange) {
        onBlockStatusChange(false);
      }
    } catch (error) {
      console.error('차단 해제 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isBlocked ? (
        <button
          onClick={handleUnblock}
          disabled={isLoading}
          className="px-4 py-2 min-w-[85px] text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors focus:outline-none disabled:opacity-50"
        >
          {isLoading ? '처리 중...' : '차단 해제'}
        </button>
      ) : (
        <button
          onClick={handleBlock}
          disabled={isLoading}
          className="px-4 py-2 min-w-[85px] text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors focus:outline-none disabled:opacity-50"
        >
          {isLoading ? '처리 중...' : '차단하기'}
        </button>
      )}
    </>
  );
} 