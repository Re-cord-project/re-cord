'use client';

import { useState } from 'react';

interface FollowButtonProps {
  userId: string;
  initialHasFollowed: boolean;
  onFollowStatusChange?: (hasFollowed: boolean) => void;
  variant?: 'default' | 'fullWidth';
}

export function FollowButton({ 
  userId, 
  initialHasFollowed, 
  onFollowStatusChange,
  variant = 'default'
}: FollowButtonProps) {
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

  const baseClasses = "h-[36px] py-2 text-sm font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 flex items-center justify-center";
  const defaultClasses = "px-4 min-w-[85px]";
  const fullWidthClasses = "w-full min-w-[85px]";

  return (
    <>
      {hasFollowed ? (
        <button
          onClick={handleUnfollow}
          disabled={isLoading}
          className={`${baseClasses} ${variant === 'default' ? defaultClasses : fullWidthClasses} ${
            variant === 'default' 
              ? 'text-gray-700 bg-gray-100 hover:bg-[#78B3CE] hover:text-white' 
              : 'border border-[#78B3CE] text-[#78B3CE] hover:bg-gray-50'
          }`}
        >
          {isLoading ? '처리 중...' : '언팔로우'}
        </button>
      ) : (
        <button
          onClick={handleFollow}
          disabled={isLoading}
          className={`${baseClasses} ${variant === 'default' ? defaultClasses : fullWidthClasses} ${
            variant === 'default'
              ? 'text-white bg-[#78B3CE] hover:bg-[#5c9bb8]'
              : 'bg-[#78B3CE] text-white hover:bg-[#A8D5E5]'
          }`}
        >
          {isLoading ? '처리 중...' : '팔로우'}
        </button>
      )}
    </>
  );
} 