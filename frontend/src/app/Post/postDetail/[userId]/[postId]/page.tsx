'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import AuthorOtherPosts from '@/components/post/AuthorOtherPosts'
import PostComments from '@/components/comment/commentSection'
import Banner from '@/components/post/Banner'
import PostContent from '@/components/post/PostContent'

interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    username: string | null
    authorId: number
    views: number
    likes: number
    status: string | null
    updateStatus: string | null
    createdAt: string | null
    updatedAt: string | null
    imageUrls: string[]
}

const PostDetail = () => {
    const params = useParams()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postId = params.postId
                const userId = params.userId
                // URL에 userId와 postId가 모두 포함됨
                const response = await fetch(`http://localhost:8090/api/posts/${postId}`)

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('게시글을 찾을 수 없습니다.')
                    } else if (response.status === 500) {
                        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
                    } else {
                        throw new Error('게시글을 불러오는데 실패했습니다.')
                    }
                }

                const data = await response.json()
                setPost(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [params.userId, params.postId])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">게시글을 불러오는 중...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8 text-red-500">{error}</div>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">게시글을 찾을 수 없습니다.</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 배너 이미지 */}
            <Banner />

            {/* 상단 여백 */}
            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                {/* 좌측 사이드바 */}
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={Number(params.userId)} />
                    <SearchBar />
                    <CategoryMenu />
                    <Statistics />
                </div>

                {/* 메인 콘텐츠 영역 */}
                <div className="flex-1 mt-6 md:mt-0">
                    {/* 게시물 내용 */}
                    <PostContent post={post} />

                    {/* 댓글 섹션 */}
                    <PostComments postId={Number(params.postId)} />

                    {/* 작성자의 다른 게시글 */}
                    <AuthorOtherPosts authorId={Number(params.userId)} />
                </div>
            </div>
        </div>
    )
}

export default PostDetail
