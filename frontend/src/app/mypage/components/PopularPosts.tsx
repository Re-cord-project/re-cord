import React from 'react'
import Link from 'next/link'
import PostCard from './PostCardProps'
import { Post } from '@/app/types/post'

type PopularPostsProps = {
    posts: Post[]
}

export default function PopularPosts({ posts }: PopularPostsProps) {
    // 조회수 기준 내림차순 정렬 후 상위 5개만 추출
    const top5 = [...posts].sort((a, b) => b.views - a.views).slice(0, 5)

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">인기 게시물 TOP 5</h2>
            <div className="space-y-2">
                {top5.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
