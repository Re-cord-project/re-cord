'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HomeDto {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  username: string;
  userId: number;
  likes: number;
  createdAt: string;
  profileImageUrl: string | null;
}

// 가입할 때 쓰는 부트캠프 목록과 맞춤
const BOOTCAMPS = [
  '멋쟁이 사자처럼',
  'SSAFY',
  '네이버 부스트캠프',
  '우아한 테크코스',
  '항해 99',
  '스파르타',
  '프로그래머스 데브코스',
  '한화시스템 BEYOND SW캠프',
  '그 외',
];

export default function BootcampPopularPosts() {
  const [selectedBootcamp, setSelectedBootcamp] = useState('멋쟁이 사자처럼'); // 첫 선택은 자유롭게 바꿀 수 있어
  const [posts, setPosts] = useState<HomeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8090/api/home/popular-posts?bootcamp=${encodeURIComponent(selectedBootcamp)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HomeDto[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error('부트캠프 인기 회고 가져오기 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, [selectedBootcamp]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-500">에러 발생: {error}</div>;

  return (
    <section className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-bold mb-6">지금 핫한 부트캠프 회고</h3>

      {/* 부트캠프 선택 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {BOOTCAMPS.map((camp) => (
          <button
            key={camp}
            onClick={() => setSelectedBootcamp(camp)}
            className={`relative text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                selectedBootcamp === camp
                  ? 'text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              
          >
            {camp}
          </button>
        ))}
      </div>

      {/* 포스트 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/postDetail/${post.userId}/${post.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-44 bg-gray-200 relative">
                {post.thumbnailUrl && (
                  <Image
                    src={post.thumbnailUrl.replace('https://s3-bucket-url.com/', '')}
                    alt="thumbnail"
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-sm mb-2">{post.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        {post.profileImageUrl ? (
                        <Image
                            src={post.profileImageUrl}
                            alt="프로필 이미지"
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                        />
                        ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300" />
                        )}
                        <span>{post.username}</span>
                    </div>

                    {/* 작성일 + 추천수 묶음 */}
                    <div className="flex items-center gap-2">
                        <span>{post.createdAt.slice(0, 10)}</span>
                        <div className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        <span>{post.likes}</span>
                        </div>
                    </div>
                    </div>

              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
