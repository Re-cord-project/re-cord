import { SearchBar } from '@/components/SearchBar';
import { FollowerList } from '@/components/FollowerList';

export default function FollowersPage() {
  return (
    <div>
      <div className="pt-0">
        <h1 className="text-2xl font-bold mb-6">팔로워</h1>
        <SearchBar placeholder="팔로워 검색" />
        <FollowerList />
      </div>
    </div>
  );
}
