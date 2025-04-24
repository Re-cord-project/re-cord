import React from "react";
import Link from "next/link";

interface AuthorProfileProps {
  author: {
    name: string;
    role: string;
    profileImage: string;
    stats: {
      followers: number;
      following: number;
      posts: number;
    };
  };
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ author }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
          <img
            src={
              author.profileImage ||
              "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer%20with%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=200&height=200&seq=2&orientation=squarish"
            }
            alt={`${author.name}의 프로필`}
            className="w-full h-full object-cover"
          />
        </div>
        <Link
          href="/mypage"
          className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
        >
          {author.name}
        </Link>
        <p className="text-xs text-gray-500 mt-1">{author.role}</p>
        <div className="flex justify-between w-full mt-4 text-xs text-gray-600">
          <div className="text-center">
            <div className="font-bold">{author.stats.followers}</div>
            <div>팔로워</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{author.stats.following}</div>
            <div>팔로잉</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{author.stats.posts}</div>
            <div>게시글</div>
          </div>
        </div>
        <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
          팔로우하기
        </button>
      </div>
    </div>
  );
};

export default AuthorProfile;
