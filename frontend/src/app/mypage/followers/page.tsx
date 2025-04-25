import { SearchBar } from '@/app/mypage/components/SearchBar';
import { FollowerList } from '@/components/follow/FollowerList';

export default function FollowersPage() {
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">팔로워</h1>
      <SearchBar placeholder="팔로워 검색" />
      <FollowerList />
    </div>
  );
}
