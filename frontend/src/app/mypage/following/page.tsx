import { SearchBar } from '@/components/SearchBar';
import { FollowingList } from '@/components/FollowingList';

export default function FollowingPage() {
  return (
    <div>
      <div className="pt-0">
        <h1 className="text-2xl font-bold mb-6">팔로잉</h1>
        <SearchBar placeholder="팔로잉 검색" />
        <FollowingList />
      </div>
    </div>
  );
}
