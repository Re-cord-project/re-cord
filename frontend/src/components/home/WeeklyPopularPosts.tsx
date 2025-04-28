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
  profileImageUrl: string | null;
  likes: number;
  createdAt: string;
  userId: number;
}

export default function WeeklyPopularPosts() {
  const [posts, setPosts] = useState<HomeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyPopularPosts = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/home/weekly-popular');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HomeDto[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error('이번 주 인기 회고 가져오기 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyPopularPosts();
  }, []);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-500">에러 발생: {error}</div>;

  return (
    <section className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-bold mb-6">이번 주 인기 회고</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/postDetail/${post.userId}/${post.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-44 bg-gray-200 relative">
                {post.thumbnailUrl ? (
                  <Image 
                    src={post.thumbnailUrl.replace('https://s3-bucket-url.com/', '')} 
                    alt="thumbnail" 
                    layout="fill" 
                    objectFit="cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div> // 썸네일 없을 때 대체 배경
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-sm mb-4">{post.title}</h4>
                <div className="flex items-center justify-between">
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
                    <span className="text-xs text-gray-600">{post.username}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <ThumbsUp size={16} /> {post.likes ?? 0}
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
