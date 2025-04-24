'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import MonthlyViewsChart from '@/app/mypage/components/MonthlyViewsChart'
import PopularPosts from '@/app/mypage/components/PopularPosts'
import PopularComments from '@/app/mypage/components/PopularComments'
import { Comment } from '@/app/types/comment'
import { Post } from '@/app/types/post'

export default function StatisticsPage() {
    // 인기 게시물, 댓글
    const [posts, setPosts] = useState<Post[]>([])
    const [comments, setComments] = useState<Comment[]>([])

    // 총 글, 댓글 수, 총 조회수
    const [postCount, setPostCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)
    const [totalViews, setTotalViews] = useState(0)

    // 월간 조회수
    const [monthlyViews, setMonthlyViews] = useState<{ month: string; totalViews: number }[]>([])

    useEffect(() => {
        console.log('🔥 useEffect 실행됨') // 여기도 콘솔 추가
        axios
            .get('/api/mypage/posts/likes?type=ordered')
            .then((res) => setPosts(Array.isArray(res.data.content) ? res.data.content : []))

        axios
            .get('/api/mypage/comments/likes?type=ordered')
            .then((res) => setComments(Array.isArray(res.data.content) ? res.data.content : []))

        // 총 글
        axios
            .get('/api/mypage/posts', { params: { page: 0, size: 1 } })
            .then((res) => setPostCount(res.data.totalElements || 0))
            .catch(console.error)

        // 총 댓글
        axios
            .get('/api/mypage/comments', { params: { page: 0, size: 1 } })
            .then((res) => setCommentCount(res.data.totalElements || 0))
            .catch(console.error)

        // 총 조회수
        axios.get<number>('/api/mypage/posts/views?type=total').then((res) => setTotalViews(res.data || 0))

        // 월간 조회수
        axios.get('/api/mypage/posts/views?type=monthly').then((res) => setMonthlyViews(res.data || []))
    }, [])

    const chartData = {
        labels: monthlyViews.map((item) => item.month + '월'),
        datasets: [
            {
                label: '조회수',
                data: monthlyViews.map((item) => item.totalViews),
                backgroundColor: 'rgba(120, 179, 206, 0.8)',
            },
        ],
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-black">통계</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-black">활동 통계</h2>

                <div className="grid grid-cols-3 gap-4">
                    <Link href="/mypage/statistics/posts" className="block">
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">총 글</p>
                            <p className="text-3xl font-bold text-black">{postCount.toLocaleString()}</p>
                        </div>
                    </Link>

                    <Link href="/mypage/statistics/comments" className="block">
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">총 댓글</p>
                            <p className="text-3xl font-bold text-black">{commentCount.toLocaleString()}</p>
                        </div>
                    </Link>

                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm text-gray-500 mb-1">총 조회수</p>
                        <p className="text-3xl font-bold text-black">{totalViews.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-black">월간 조회수 추이</h2>
                <div className="bg-white p-4 rounded shadow h-64">
                    <MonthlyViewsChart data={chartData} />
                </div>
            </div>

            {/* 인기 게시물 섹션 */}
            <PopularPosts posts={posts} />

            {/* 인기 댓글 섹션 */}
            <PopularComments comments={comments} />
        </>
    )
}
