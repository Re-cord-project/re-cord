'use client';

import { useState, useEffect } from 'react';
import { BlockButton } from './blockButton';
import { BlockUser } from '@/types/user';

export const BlockList = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('/api/users/block');
      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data);
      }
    } catch (error) {
      console.error('차단 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredUsers.map(user => (
        <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <img
              src={user.profileImage || '/default-profile.png'}
              alt={user.nickname}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.nickname}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <BlockButton userId={user.id} isBlocked={true} onBlockChange={fetchBlockedUsers} />
        </div>
      ))}
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 py-4">차단한 사용자가 없습니다.</p>
      )}
    </div>
  );
}; 