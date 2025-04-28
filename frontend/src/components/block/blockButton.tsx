'use client';

import { useState } from 'react';

interface BlockButtonProps {
  userId: number;
  isBlocked: boolean;
  onBlockChange: () => void;
}

export const BlockButton = ({ userId, isBlocked, onBlockChange }: BlockButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockAction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/block', {
        method: isBlocked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockedId: userId }),
      });

      if (response.ok) {
        onBlockChange();
      }
    } catch (error) {
      console.error('차단 상태 변경에 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBlockAction}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        isBlocked
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {isLoading ? '처리중...' : isBlocked ? '차단 해제' : '차단하기'}
    </button>
  );
}; 