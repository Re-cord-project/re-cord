'use client'

import React, { useState, useEffect } from 'react'

import axios from 'axios'
import PostCard from '@/app/mypage/components/PostCardProps'
import { Post } from '@/app/types/post'

interface PostResponse {
    content: Post[]
    totalPages: number
    totalElements: number // 추가
}

export default function UserPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [sortType, setSortType] = useState<'date' | 'likes' | 'views'>('date')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)

    useEffect(() => {
        fetchPosts(sortType, page)
    }, [sortType, page])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const fetchPosts = async (sort: string, page = 0) => {
        try {
            let endpoint = ''
            let params: any = { page, size: 5 }
            switch (sort) {
                case 'views':
                    endpoint = `/api/mypage/posts/views`
                    params.type = 'ordered'
                    break
                case 'likes':
                    endpoint = `/api/mypage/posts/likes`
                    params.type = 'ordered'
                    break
                case 'date':
                default:
                    endpoint = `/api/mypage/posts`
            }
            const response = await axios.get<PostResponse>(endpoint, { params })
            setPosts(response.data.content)
            setTotalPages(response.data.totalPages)
            setTotalElements(response.data.totalElements)
        } catch (error) {
            console.error('Failed to fetch posts:', error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">내 게시글 ({totalElements})</h1>
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

            <div className="flex gap-2 mt-4 justify-center items-center">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className={`px-4 py-2 rounded font-bold transition-colors ${
                        page === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#78B3CE] text-white hover:bg-[#5a8ca8]'
                    }`}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx)}
                        className={`px-3 py-2 rounded font-bold transition-colors ${
                            page === idx ? 'bg-[#78B3CE] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-4 py-2 rounded font-bold transition-colors ${
                        page + 1 >= totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#78B3CE] text-white hover:bg-[#5a8ca8]'
                    }`}
                >
                    다음
                </button>
            </div>
        </>
    )
}
