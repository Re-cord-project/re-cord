'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import PostCard from '@/app/mypage/components/PostCardProps'

interface Post {
    id: number // Long
    userId: number // Long
    title: string
    content: string
    views: number // int
    likes: number // int
    createdAt: string // LocalDateTime은 프론트에서 string으로 받음
}

export default function UserPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [sortType, setSortType] = useState<'date' | 'likes' | 'views'>('date')

    useEffect(() => {
        fetchPosts(sortType)
    }, [sortType])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const fetchPosts = async (sort: string) => {
        try {
            let endpoint

            switch (sort) {
                case 'views': {
                    endpoint = `/api/mypage/posts/views?type=ordered`
                    const response = await axios.get<Post[]>(endpoint)
                    setPosts(response.data)
                    break
                }
                case 'likes': {
                    endpoint = `/api/mypage/posts/likes?type=ordered`
                    const response = await axios.get<Post[]>(endpoint)
                    setPosts(response.data)
                    break
                }
                case 'date': {
                    endpoint = `/api/mypage/posts`
                    const response = await axios.get<Post[]>(endpoint)
                    const sortedPosts = response.data.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    })
                    setPosts(sortedPosts)
                    break
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch posts:', error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">내 게시글 ({posts.length})</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortType('date')}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${
                            sortType === 'date'
                                ? 'bg-[#78B3CE] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => setSortType('views')}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${
                            sortType === 'views'
                                ? 'bg-[#78B3CE] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        조회수 순
                    </button>
                    <button
                        onClick={() => setSortType('likes')}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${
                            sortType === 'likes'
                                ? 'bg-[#78B3CE] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        좋아요 순
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} showEditDelete />
                ))}
            </div>
        </>
    )
}
