'use client';

import { useState } from 'react';

interface FollowButtonProps {
  userId: string;
  initialHasFollowed: boolean;
  onFollowStatusChange?: (hasFollowed: boolean) => void;
}

export function FollowButton({ userId, initialHasFollowed, onFollowStatusChange }: FollowButtonProps) {
  const [hasFollowed, setHasFollowed] = useState(initialHasFollowed);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // 팔로우 처리
  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: Number(userId) }),
      });
      
      if (!res.ok) {
        console.error('팔로우 실패:', res.status);
        return;
      }
      
      setHasFollowed(true);
      if (onFollowStatusChange) {
        onFollowStatusChange(true);
      }
    } catch (error) {
      console.error('팔로우 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 언팔로우 처리
  const handleUnfollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/follow`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: Number(userId) }),
      });
      
      if (!res.ok) {
        console.error('언팔로우 실패:', res.status);
        return;
      }
      
      setHasFollowed(false);
      if (onFollowStatusChange) {
        onFollowStatusChange(false);
      }
    } catch (error) {
      console.error('언팔로우 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {hasFollowed ? (
        <button
          onClick={handleUnfollow}
          disabled={isLoading}
          className="w-full py-2 border border-[#78B3CE] text-[#78B3CE] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
        >
          {isLoading ? '처리 중...' : '언팔로우'}
        </button>
      ) : (
        <button
          onClick={handleFollow}
          disabled={isLoading}
          className="w-full py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#A8D5E5] transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
        >
          {isLoading ? '처리 중...' : '팔로우'}
        </button>
      )}
    </>
  );
} 