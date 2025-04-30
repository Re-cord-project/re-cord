'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import CommentCard from '@/app/mypage/components/CommentCardProps'
import { Comment } from '@/app/types/comment'

interface CommentResponse {
    content: Comment[]
    totalPages: number
    totalElements: number // 추가
}

export default function UserCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([])
    const [sortType, setSortType] = useState<'date' | 'likes'>('date')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

    useEffect(() => {
        fetchComments(sortType, page)
    }, [sortType, page])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // 정렬된 댓글 목록
    const fetchComments = async (sort: string, page = 0) => {
        try {
            let endpoint = ''
            let params: any = { page, size: 5 }

            switch (sort) {
                case 'likes': {
                    endpoint = '/api/mypage/comments/likes'
                    params.type = 'ordered'
                    break
                }
                case 'date':
                default: {
                    endpoint = '/api/mypage/comments'
                }
            }

            const response = await axios.get<CommentResponse>(`${API_BASE_URL}${endpoint}`, {
                params,
                withCredentials: true, // ✅ 쿠키 포함하여 인증 필요 시
            })

            setComments(response.data.content)
            setTotalPages(response.data.totalPages)
            setTotalElements(response.data.totalElements)
        } catch (error: any) {
            console.error('Error fetching comments:', error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">내 댓글 ({totalElements})</h1>
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
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} showEditDelete />
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
