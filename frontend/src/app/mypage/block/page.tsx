import { SearchBar } from '@/components/SearchBar';
import { BlockedUserList } from '@/components/BlockedUserList';

export default function BlockedUsersPage() {
  return (
    <div>
      <div className="pt-0">
        <h1 className="text-2xl font-bold mb-6">차단 유저</h1>
        <SearchBar placeholder="차단 유저 검색" />
        <BlockedUserList />
      </div>
    </div>
  );
}
