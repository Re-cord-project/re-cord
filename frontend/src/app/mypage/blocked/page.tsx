import { SearchBar } from '@/app/mypage/components/SearchBar';
import { BlockUserList } from '@/app/mypage/components/BlockUserList';

export default function BlockedUsersPage() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">차단 유저</h1>
      <SearchBar placeholder="차단 유저 검색" />
      <BlockUserList />
    </div>
  );
}
