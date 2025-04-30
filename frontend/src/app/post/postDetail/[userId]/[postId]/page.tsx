'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import AuthorOtherPosts from '@/components/post/AuthorOtherPosts'
import PostComments from '@/components/comment/commentSection'
import Banner from '@/components/post/Banner'
import PostContent from '@/components/post/PostContent'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// 타입 정의를 명확히 개선
interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    categoryId?: number
    username: string | null
    userId: number
    views: number
    likes: number
    status: string | null
    updateStatus: string | null
    createdAt: string | null
    updatedAt: string | null
    imageUrls: string[]
    authorId?: number
}

// API 관련 상수
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// 게시글 데이터 가져오는 커스텀 훅
const usePostData = (postId: string) => {
    const [post, setPost] = React.useState<Post | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/public/${postId}`)

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
    }, [postId])

    return { post, isLoading, error }
}

// 레이아웃 컴포넌트 분리
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-white">
        <Banner />
        <div className="h-6" />
        <div className="max-w-7xl mx-auto px-4">{children}</div>
    </div>
)

// 상태 메시지 컴포넌트
const StatusMessage: React.FC<{ message: string; isError?: boolean }> = ({ message, isError }) => (
    <div className={`text-center py-8 ${isError ? 'text-red-500' : ''}`}>{message}</div>
)

const PostDetail = () => {
    const params = useParams()
    const postId = params.postId as string
    const userId = params.userId as string
    const { post, isLoading, error } = usePostData(postId)
    const { loginUser } = useGlobalLoginUser()

    if (isLoading) {
        return (
            <PageLayout>
                <StatusMessage message="게시글을 불러오는 중..." />
            </PageLayout>
        )
    }

    if (error) {
        return (
            <PageLayout>
                <StatusMessage message={error} isError />
            </PageLayout>
        )
    }

    if (!post) {
        return (
            <PageLayout>
                <StatusMessage message="게시글을 찾을 수 없습니다." />
            </PageLayout>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Banner />
            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                {/* 좌측 사이드바 */}
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={Number(userId)} />
                    <SearchBar />
                    <CategoryMenu userId={Number(userId)} />
                    {/* userId가 숫자로 있을 때만 렌더 */}
                    {userId != null && (
                      <Statistics userId={Number(userId)} />
                   )}
                </div>

                {/* 메인 콘텐츠 영역 */}
                <div className="flex-1 mt-6 md:mt-0">
                    <PostContent
                        post={{
                            ...post,
                            userId: Number(userId),
                            categoryId: post.categoryId || 1,
                            imageUrls: post.imageUrls || [],
                        }}
                        loginUserId={loginUser?.id}
                    />

                    <PostComments postId={Number(postId)} />
                    <AuthorOtherPosts authorId={Number(userId)} />
                </div>
            </div>
        </div>
    )
}

export default PostDetail
